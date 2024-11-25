"use client"

import { MotherDuckClientProvider, useMotherDuckClientState } from "@/lib/motherduck/context/motherduckClientContext";
import { useCallback, useState, useEffect } from "react";

const SQL_QUERY_STRING = "select * from duckdb_databases() where internal = false;";

const useFetchAllDatabases = () => {
    const { safeEvaluateQuery } = useMotherDuckClientState();
    const [error, setError] = useState<string | null>(null);

    const fetchAllDatabases = useCallback(async () => {
        try {
            const safeResult = await safeEvaluateQuery(SQL_QUERY_STRING);
            if (safeResult.status === "success") {
                return safeResult.result.data.toRows().map((row) => row.database_name?.valueOf() as string);
                
            } else {
                setError("Query failed with error: " + safeResult.err);
                return [];
            }
        } catch (error) {
            setError("fetchAllDatabases failed with error: " + error);
            return [];
        }

    }, [safeEvaluateQuery]);

    return { fetchAllDatabases, error };
}


function DatabaseList() {
    const { fetchAllDatabases, error } = useFetchAllDatabases();
    const [databases, setDatabases] = useState<string[]>([]);

    const handleFetchAllDatabases = async () => {
        const dbs = await fetchAllDatabases();
        setDatabases(dbs);
    };

    useEffect(() => {
        const fetch = async () => {
            const dbs = await fetchAllDatabases();
            setDatabases(dbs);
        };
        fetch();
    }, [fetchAllDatabases]);

    return (
        <div className="p-5">
            <p className=""> Your MotherDuck Databases: </p>
            {error && <p className="text-red-500">{error}</p>}
            <div>
                <ul>
                    {databases.map((db) => (
                        <li key={db}>{db}</li>
                    ))}
                </ul>
            </div>
            <button onClick={handleFetchAllDatabases} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l" >Refresh</button>
        </div>
    );
}

export default function Home() {
    return (
        <div>
            <MotherDuckClientProvider>
                <DatabaseList />
            </MotherDuckClientProvider>
        </div>
    );
}

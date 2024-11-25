// This function fetches a MotherDuck token for the frontend to use to connect to MotherDuck.
// read_only: true fetches a new read-only token with a set expiration time.
export async function fetchMotherDuckToken(read_only: boolean = true): Promise<string> {
    const response = await fetch(`/api/md-token?read_only=${read_only}`)
    const { mdToken, expire_at } = await response.json()
    return mdToken
}

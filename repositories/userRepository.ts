import {connection} from "../database/database"

export async function getRanking(){
    const result = await connection.query(
        `
        SELECT * FROM fighters ORDER BY wins DESC, draws DESC;
        `
    )

    return result.rows
}

export async function findByUsername(username: string) {
    const result = await connection.query(
        `
        SELECT * FROM figthers WHERE username = $1
        `, [username]
    );
        return result.rows[0];
}

export async function insert(username: string) {
    const result = await connection.query(
        `
        INSERT INTO fighters (username, wins, losses, draws)
        VALUES ($1, 0, 0, 0)
        RETURNING id
        `, [username]
    )
    
    return result.rows[0]
}

export async function updateStats(id: number, column: "wins" | "losses" | "draws"){
    connection.query(
        `
        UPDATE figthers SET ${column} = ${column} +1 WHERE id = $1
        `, [id]
    )
}
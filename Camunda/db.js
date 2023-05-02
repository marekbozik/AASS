import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'aws.connect.psdb.cloud',
  user: '6an9exq91jm3ebbi7zro',
  password: 'pscale_pw_uZHsSNsDGes6JxpiGrmMkfEdf34xfVGG64xOXVOF48J',
  database: 'ais',
  ssl: {
    rejectUnauthorized: false
  }
});

export async function getUsers(studentId) {
  try {
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.execute(`SELECT * FROM User WHERE Id = ${studentId}`);
    connection.release();
    return rows;
  } catch (error) {
    console.error(error);
  }
}

export async function getSubject(subjectId) {
  try {
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.execute(`SELECT * FROM ais.Group WHERE Id = ${subjectId}`);
    connection.release();
    return rows;
  } catch (error) {
    console.error(error);
  }
}

export async function getRegistration(studentId, subjectId) {
  try {
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.execute(`SELECT * FROM GroupMembers WHERE UserId = ${studentId} AND GroupId = ${subjectId}`);
    connection.release();
    return rows;
  } catch (error) {
    console.error(error);
  }
}

export async function createRegistration(studentId, subjectId) {
  try {
    const connection = await pool.getConnection();
    //const [rows, fields] = 
    await connection.execute(`INSERT INTO GroupMembers (UserId, GroupId) VALUES (${studentId}, ${subjectId})`);
    connection.release();
    //return rows;
  } catch (error) {
    console.error(error);
  }
}

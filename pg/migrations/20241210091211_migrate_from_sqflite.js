const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '../../sqlite/grid_state.db');

const openSQLiteDB = () => {
  return new sqlite3.Database(dbPath);
};

const fetchData = async (db, tableName) => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const formatData = (data) => {
  return data.map((row) => ({
    x: row.x,
    y: row.y,
    color: row.color,
    created_at: new Date(row.last_updated * 1000),
  }));
};

exports.up = async function (knex) {
  const sqliteDB = openSQLiteDB();
  const tableName = 'grid_state';

  try {
    const sqliteData = await fetchData(sqliteDB, tableName);
    const formattedData = formatData(sqliteData);

    if (sqliteData.length > 0) {
      await knex.batchInsert('pixel_state', formattedData, 1000);
    }
  } catch (err) {
    console.log('Error during data migration');
    throw err;
  } finally {
    sqliteDB.close();
  }
};

exports.down = async function (knex) {
  await knex('pixel_state').truncate();
};

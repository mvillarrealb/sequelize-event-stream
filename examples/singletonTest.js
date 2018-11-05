class DB {
  connect() {
    return Promise.resolve({
      foo: `Bar ${new Date()}`
    });
  }
}

class SingletonTest {
  constructor() {
    this.db = new DB();
  }

  getConnection() {
    if (!this.connection) {
      console.log('Creating Connection');
      this.connection = this.db.connect();
    }
    return this.connection;
  }
}
(async function main() {
  const single = new SingletonTest();

  const a = await single.getConnection();
  const b = await single.getConnection();
  const c = await single.getConnection();
  const d = await single.getConnection();

  console.table({ a, b, c, d });
})();

const {
  exists,
  set,
} = require('@src/redis')
const { createDemoData } = require("@src/demo-data");


exports.initData = async () => {
  const totalUsersKeyExist = await exists("total_users");
  if (!totalUsersKeyExist) {
    await set("total_users", 0);
    await set(`room:${0}:name`, "General");
    await createDemoData();
  }
}
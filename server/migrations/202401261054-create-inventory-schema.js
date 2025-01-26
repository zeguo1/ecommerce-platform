'use strict';

module.exports = {
  async up(db) {
    await db.createCollection('inventories', {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["productId", "stock"],
          properties: {
            productId: {
              bsonType: "objectId",
              description: "必须关联商品ID"
            },
            stock: {
              bsonType: "int",
              minimum: 0,
              description: "库存数量必须大于等于0"
            }
          }
        }
      }
    });
  },

  async down(db) {
    await db.dropCollection('inventories');
  }
};

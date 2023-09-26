/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("aiy0tocp5cmmuam")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "35yffxnz",
    "name": "user_id",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("aiy0tocp5cmmuam")

  // remove
  collection.schema.removeField("35yffxnz")

  return dao.saveCollection(collection)
})

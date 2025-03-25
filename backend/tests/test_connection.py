from db.mongo import get_db

db = get_db()
print("✅ Conectado a MongoDB")

# Probar insertar y leer algo
test = db["test"]
test.insert_one({"mensaje": "¡Hola MongoDB!"})
print("✅ Insertado")
doc = test.find_one()
print("📄 Documento:", doc)

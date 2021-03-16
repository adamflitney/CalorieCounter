const admin = require('firebase-admin')
const serviceAccount = require('./firestoreAcess.json')

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

exports.handler = async (event) => {
  try {
    const db = admin.firestore()
    // create an entry
    try {
      const dbAllEntriesRef = db.collection('entries')
      const dbAllEntriesSnapshot = await dbAllEntriesRef.get()
      if (dbAllEntriesSnapshot.empty) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'collection empty' }),
        }
      }

      let allEntries = []

      dbAllEntriesSnapshot.forEach((doc) => {
        allEntries.push(doc.data())
      })

      return {
        statusCode: 200,
        body: JSON.stringify({ entries: allEntries }),
      }
    } catch (err) {
      console.log(err)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'unable to get entries' }),
      }
    }
  } catch (err) {
    console.log('error!')
    return {
      statusCode: 400,
      body: JSON.stringify({ message: err }),
    }
  }
}

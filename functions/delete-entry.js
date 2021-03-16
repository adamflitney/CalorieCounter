const admin = require('firebase-admin')
const serviceAccount = require('./firestoreAcess.json')

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

exports.handler = async (event) => {
  try {
    const request = JSON.parse(event.body)
    const db = admin.firestore()
    // create an entry
    try {
      const dbEntryRef = db.collection('entries').doc(request.id)
      const existingDbEntry = await dbEntryRef.get()
      if (!existingDbEntry.exists) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'entry does not exist' }),
        }
      }
      const result = await dbEntryRef.delete()
      console.log(result)
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'entry deleted', message: result }),
      }
    } catch (err) {
      console.log(err)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'unable to delete entry' }),
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

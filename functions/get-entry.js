const admin = require('firebase-admin')
const serviceAccount = require('./firestoreAcess.json')

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

exports.handler = async (event) => {
  try {
    request = JSON.parse(event.body)
    const db = admin.firestore()
    // create an entry
    try {
      const dbEntryRef = db.collection('entries').doc(request.id)
      const existingDbEntry = await dbEntryRef.get()
      if (!existingDbEntry.exists) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'cannot find entry' }),
        }
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ entry: existingDbEntry.data() }),
      }
    } catch (err) {
      console.log(err)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'unable to get entry' }),
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

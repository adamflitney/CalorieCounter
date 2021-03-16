const admin = require('firebase-admin')
const serviceAccount = require('./firestoreAcess.json')

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

const isValidEntry = (entry) => {
  console.log(entry)
  return entry && entry.hasOwnProperty('date') && entry.hasOwnProperty('items')
}

exports.handler = async (event, context) => {
  let newEntry = {}
  try {
    request = JSON.parse(event.body)
    if (isValidEntry(request.entry)) {
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
        const result = await dbEntryRef.set(request.entry)
        console.log(result)
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'entry updated', entry: result }),
        }
      } catch (err) {
        console.log(err)
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'unable to update entry' }),
        }
      }
    } else {
      throw new Error('invalid entry')
    }
  } catch (err) {
    console.log('error!')
    return {
      statusCode: 400,
      body: JSON.stringify({ message: err }),
    }
  }
}

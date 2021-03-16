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
    newEntry = JSON.parse(event.body)
    if (isValidEntry(newEntry)) {
      const db = admin.firestore()
      // create an entry
      try {
        const dbEntryRef = db.collection('entries').doc(newEntry.date)
        const existingDbEntry = await dbEntryRef.get()
        if (existingDbEntry.exists) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'entry already exists' }),
          }
        }
        const result = await dbEntryRef.set(newEntry)
        console.log(result)
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'entry added', entry: result }),
        }
      } catch (err) {
        console.log(err)
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'unable to add entry' }),
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

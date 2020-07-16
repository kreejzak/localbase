import * as localForage from "localforage";
import logger from '../../utils/logger'
import isSubset from '../../utils/isSubset'

export default function set(newDocument) {

  // set document by criteria
  this.setDocumentByCriteria = () => {
    let docsToSet = []
    localForage.iterate((value, key) => {
      if (isSubset(value, this.docSelectionCriteria)) {
        docsToSet.push({ key, newDocument })
      }
    }).then(() => {
      if (docsToSet.length > 1) {
        logger.warn(`Multiple documents (${ docsToSet.length }) with ${ JSON.stringify(this.docSelectionCriteria) } found for setting.`)
      }
      docsToSet.forEach(docToSet => {
        localForage.setItem(docToSet.key, docToSet.newDocument)
      })
      logger.log(`${ docsToSet.length } Document${ docsToSet.length > 1 ? 's' : '' } in "${ this.collectionName }" collection with ${ JSON.stringify(this.docSelectionCriteria) } set to:`, newDocument)
      this.reset()
    })
  }

  // set document by key
  this.setDocumentByKey = () => {
    localForage.setItem(this.docSelectionCriteria, newDocument).then(value => {
      logger.log(`Document in "${ this.collectionName }" collection with key ${ JSON.stringify(this.docSelectionCriteria) } set to:`, newDocument)
      this.reset()
    }).catch(err => {
      logger.error(`Document in "${ this.collectionName }" collection with key ${ JSON.stringify(this.docSelectionCriteria) } could not be set.`);
      this.reset()
    })
  }

  if (typeof this.docSelectionCriteria == 'object') {
    return this.setDocumentByCriteria()
  }
  else {
    return this.setDocumentByKey()
  }
}
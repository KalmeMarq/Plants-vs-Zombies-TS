export default class Util {
  public static calculateLocalStorageSize(): number {
    // Found on stackoverflow. :)
    function getLeftStorageSize() {
      var itemBackup = localStorage.getItem("")
      var increase = true
      var data = "1"
      var totalData = ""
      var trytotalData = ""
      while (true) {
        try {
          trytotalData = totalData + data
          localStorage.setItem("", trytotalData)
          totalData = trytotalData
          if (increase) data += data
        } catch (e) {
          if (data.length < 2) break
          increase = false
          data = data.substr(data.length / 2)
        }
      }
      localStorage.setItem("", itemBackup ?? '')
  
      return totalData.length
    }
  
    var storageLeft = getLeftStorageSize()
    console.log(storageLeft)
  
    localStorage.clear()
    var storageMax = getLeftStorageSize()
    return storageMax - storageLeft
  }
}
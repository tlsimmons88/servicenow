var delimiter = ",";
var csvData = "changeMe";

//get header from csv
var headers = csvData.slice(0, csvData.indexOf('\n')).split(delimiter);

//get rows from csv
var rows = csvData.slice(csvData.indexOf("\n") + 1).split("\n");

var arr = rows.map(function (row) {
      var values = row.split(delimiter);
      var element = headers.reduce(function (object, header, index) {
        var header = header.trim();
        object[header] = values[index].trim();
        return object;
      }, {});
      return element;
    });

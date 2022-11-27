  // function set_document_variable(doc){
//     xmlDoc = doc;
// }
function print_graph(eval_map, year_labels){
    var marks = ["A", "B", "C", "D", "E", "Fx", "Fn"];
    var data = [];
    var counter = 0;
    for(let eval of eval_map.entries()){
      var trace = {
        x: year_labels,
        y: eval[1],
        name: eval[0],
        type: 'bar'
      }         
      data.push(trace);
    }
    var layout = {barmode: 'group'};

    Plotly.newPlot('graph-holder', data, layout);
}
function sendXMLrequest(path, func) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {func(this);};
    xhttp.open("GET", path, true);
    xhttp.send();
}
function getYearLabels(xml){
    var zaznam_tags = xml.getElementsByTagName("zaznam");
    var year_labels = [];
    for (let n=0;n<zaznam_tags.length;n++){
        var values = [];
        var year_label = zaznam_tags[n].getElementsByTagName("rok")[0].innerHTML;
        year_labels.push(year_label);
    }
    return year_labels;
}
function getEvaluationMap(xml){
    const eval_map = new Map();
    var marks = ["A", "B", "C", "D", "E", "FX", "FN"];
    for(let i=0;i<marks.length;i++){
        var html_collection = xml.getElementsByTagName(marks[i]);
        var collect = [];
        for (let n=0;n<html_collection.length;n++){
            collect.push(html_collection[n].innerHTML);
        }
        eval_map.set(marks[i], collect);
                
    }
    return eval_map;   
}

function main(xhttp){
    var xml_doc = xhttp.responseXML;
    var eval_map = getEvaluationMap(xml_doc);
    var year_labels = getYearLabels(xml_doc);
    print_graph(eval_map, year_labels);
}

function createXMLfromHTML(response_text){
    var parser = new DOMParser();
    return parser.parseFromString(response_text, "text/xml");
}

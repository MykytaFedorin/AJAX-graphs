  // function set_document_variable(doc){
//     xmlDoc = doc;
// }
function print_graph_scatter(eval_map){
    var data = [];
    var maps_of_marks = eval_map.get('y').entries();
    for(let map of maps_of_marks){
        var trace = {
            x: eval_map.get('x'),
            y: map[1],
            type: "scatter",
            name: map[0]
        };
        data.push(trace);
    } 
    Plotly.newPlot('scatter-div', data)
}
function print_graph_bar(eval_map, year_labels){
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
      var layout = {barmode: 'group'};
    }
    Plotly.newPlot("bar-div", data, layout);
}
function print_graph_pie(eval_map, year_labels){
    var marks = ["A", "B", "C", "D", "E", "Fx", "Fn"];
    var counter = 1;
    for(let eval of eval_map.entries()){
        var trace = {
          values: eval[1],
          labels: marks,
          type: "pie",
          hoverinfo: 'label+percent+name'
        }
        var data = [];
        data.push(trace);
        var layout = {
            width: 350,
            height: 350,
            title:"Úspešnosť "+eval[0]};
        var div_name="pie-div";
        div_name = div_name+counter.toString();
        Plotly.newPlot(div_name, data, layout);
        var div = document.getElementById(div_name);
        counter++;
    }
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
function getBarEvaluation(xml){
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
function getPieEvaluation(xml){
    var zaznamy = xml.getElementsByTagName("zaznam");
    var eval_map = new Map();
    for(let i=0;i<zaznamy.length;i++){
        var year = zaznamy[i].getElementsByTagName("rok")[0].innerHTML;
        var values = [];
        var hodnotenie = zaznamy[i].getElementsByTagName("hodnotenie");
          for(let n=0;n<hodnotenie[0].childNodes.length;n++){
              var val = hodnotenie[0].childNodes[n].innerHTML;
              if(val){
                values.push(val);
              }  
          }
    eval_map.set(year, values);
    }
    return eval_map;
}

function getScatterEvaluation(xml){
    // x coordinate on the plot must be year of examine,
    // and y coordinate on the plot must be number of each mark.
    // There will be as much lines on the plot, as much marks exists.
    // For instance (A-FN) is equal to 7 marks.

    var mark_names = ["A", "B", "C", "D", "E", "FX", "FN"];
    var zaznamy = xml.getElementsByTagName("zaznam");
    var eval_map = new Map();
    var year_tags = xml.getElementsByTagName("rok");
    var year_values = [];
    var mark_values = new Map;
    for(var i=0;i<year_tags.length;i++){
        year_values.push(year_tags[i].innerHTML);
    } 
    for(var i=0;i<mark_names.length;i++){
        var mark_tags = xml.getElementsByTagName(mark_names[i]);
        var values = [];
        for (var n =0; n<mark_tags.length;n++){
            values.push(mark_tags[n].innerHTML);
        }
        mark_values.set(mark_names[i], values);
    }
    eval_map.set('x', year_values);
    eval_map.set('y', mark_values);
    return eval_map;
}

function getEvaluationMap(xml, mode){
    switch(mode){
        case 'bar':
          return getBarEvaluation(xml);
        case 'pie':
          return getPieEvaluation(xml);
        case 'scatter':
            return getScatterEvaluation(xml);
        default:
          break;
    }
}

function main(xhttp){
    var xml_doc = xhttp.responseXML;
    var eval_map_bar = getEvaluationMap(xml_doc, "bar");
    var eval_map_pie = getEvaluationMap(xml_doc, "pie");
    var eval_map_scatter = getEvaluationMap(xml_doc, "scatter")
    var layout_bar = {barmode: 'group'};
    var layout_pie = {width: 400, height: 500};
    var year_labels = getYearLabels(xml_doc);
    print_graph_bar(eval_map_bar, year_labels);
    print_graph_pie(eval_map_pie, year_labels);
    print_graph_scatter(eval_map_scatter);
}

function createXMLfromHTML(response_text){
    var parser = new DOMParser();
    return parser.parseFromString(response_text, "text/xml");
}

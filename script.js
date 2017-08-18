var vdnum;var z = {};var normalizedZ = {};var constraints = [];var normalizedConstraints = [];var tableNumber = 2;$(function () {    $("#btn_vdnum").click(function () {        vdnum = parseInt($("#vdnum").val());        $(".first-step").hide();        $(".second-step").removeClass("d-none");        var row_function = $("#row_function");        for (var i = 0; i < vdnum; i++) {            var divNumber = $("<div></div>").addClass("col-sm-2");            var input = $("<input/>").attr("type", "number").addClass("form-control");            divNumber.append(input);            var extra = "";            if (i + 1 < vdnum) {                extra = " +";            }            var divDesc = $("<div></div>").addClass("col-sm-1").text("X" + (i + 1) + extra);            row_function.append(divNumber);            row_function.append(divDesc);        }    });    $("#btn_new_constraint").click(function () {        var row_constraints = $("#row_constraints");        var divRow = $("<div></div>").addClass("row").css("margin-top", "10px");        row_constraints.append(divRow);        for (var i = 0; i < vdnum; i++) {            var divNumber = $("<div></div>").addClass("col-sm-2");            var input = $("<input/>").attr("type", "number").addClass("form-control");            divNumber.append(input);            var extra = "";            if (i + 1 < vdnum) {                extra = " +";            }            var divDesc = $("<div></div>").addClass("col-sm-1").text("X" + (i + 1) + extra);            divRow.append(divNumber);            divRow.append(divDesc);        }        var divOperator = $("<div></div>").addClass("col-sm-1").text("<=");        divRow.append(divOperator);        var divNumber = $("<div></div>").addClass("col-sm-2");        var input = $("<input/>").attr("type", "number").addClass("form-control");        divNumber.append(input);        divRow.append(divNumber);    });    $("#btn_constraint_ok").click(function () {        var zNormalizedOutput = "";        $(this).hide();        $("#btn_new_constraint").hide();        $(".third-step").removeClass("d-none");        var count = 1;        //pakouri field de fonksyon objektif yo        $("#row_function input[type='number']").each(function () {            z["x" + count] = $(this).val();            var sign = "";            if ($(this).val() >= 0) {                sign = " +";            }            zNormalizedOutput += sign + $(this).val() + " x" + count;            count++;        });        normalizedZ = $.extend({}, z);        count = 1;        var varOpt = 0;        var firstLoopGlobal = true;        var isMax = $("#type option:selected").val() === "true" ? true : false;        $("#row_constraints .row").each(function () {            var values = {                "variab_decision": {},                "constraint": 0,                "variab_perso": {}            };            var count2 = 1;            var variableInputs = $(this).find("input[type='number']");            variableInputs.each(function () {                if (count2 !== variableInputs.length) {                    values.variab_decision["x" + count2] = $(this).val();                } else {                    values.constraint = $(this).val();                }                count2++;            });            //ajoute variab de holgura yo            if (firstLoopGlobal) {                count2--;                firstLoopGlobal = false;                varOpt = count2;            } else {                varOpt++;            }            values.variab_perso["x" + varOpt] = 1;            constraints.push(values);            normalizedZ["x" + (count + vdnum)] = 0;            zNormalizedOutput += " +0" + " x" + (count + vdnum);            count++;        });        //afiche fonksyon objektif la e kontrent normalize yo         $("#new-function").append(zNormalizedOutput);        var row_constraints_normalized = $("#row_constraints_normalized");        $.each(constraints, function () {            var divRow = $("<div></div>").addClass("row").css("margin-top", "10px");            row_constraints_normalized.append(divRow);            var divConstraint = $("<div></div>").addClass("col-sm-12 text-center");            divRow.append(divConstraint);            var text = "";            var firstLoop = true;            $.each(this.variab_decision, function (k, v) {                if (!firstLoop) {                    text += " + ";                } else {                    firstLoop = false;                }                text += v + " " + k;            });            $.each(this.variab_perso, function (k, v) {                text += " + " + v + " " + k;            });            text += " = " + this.constraint;            divConstraint.text(text);        });        //Kreye table yo e kalkile done yo        var tables_container = $("#tables_container");        var row = $("<div></div>").addClass("row text-center");        var columnTableName = $("<div></div>").addClass("col-sm-12");        var h1 = $("<h1>").text("Tabla 1");        var columnTable = $("<div>").addClass("col-sm-12");        var table = $("<table>").addClass("table table-striped table-inverse table-bordered table-hover");        var thead = $("<thead>");        var tr_thead = $("<tr>");        var tbody = $("<tbody>");        columnTableName.append(h1);        row.append(columnTableName);        tables_container.append(row);        row.append(columnTable);        columnTable.append(table);        table.append(thead).append(tbody);        thead.append(tr_thead);        var thBase = $("<th>").text("Base");        var thP0 = $("<th>").text("P0");        tr_thead.append(thBase).append(thP0);        $.each(constraints[0].variab_decision, function (k) {            var th = $("<th>").text(k.toUpperCase());            tr_thead.append(th);        });        $.each(constraints, function () {            var tr = $("<tr>");            tbody.append(tr);            var variblePersos = [];            $.each(this.variab_perso, function (k) {                var th = $("<th>").text(k.toUpperCase());                tr_thead.append(th);                var td = $("<td>").text(k.toUpperCase());                tr.prepend(td);                variblePersos.push(k);            });            //p0            var tdP0 = $("<td>").text(this.constraint);            tr.append(tdP0);            $.each(this.variab_decision, function () {                var td = $("<td>").text(this);                tr.append(td);            });            $.each(constraints, function () {                $.each(this.variab_perso, function (k) {                    var td;                    if (variblePersos.indexOf(k) !== -1) {                        td = $("<td>").text("1");                    } else {                        td = $("<td>").text("0");                    }                    tr.append(td);                });            });        });        //ajoute z la e done li yo        var trZ = $("<tr>");        var tdZBase = $("<td>").text("Z");        var tdZP0 = $("<td>").text("0");        trZ.append(tdZBase, tdZP0);        $.each(normalizedZ, function () {            var val = this;            if (isMax) {                val *= -1;            }            var td = $("<td>").text(val);            trZ.append(td);        });        tbody.append(trZ);        //kalkile li pou max        if (isMax) {            calculateMax(table, row);        } else { //sinon pou min            calculateMin(table, row);        }    });});/** * Calculate for Max * @param {jQuery} table * @param {jQuery} tableRow row de table la * @returns {undefined} */function calculateMax(table, tableRow) {    calculate(table, tableRow, true);}/** * Calculate for Min * @param {jQuery} table * @param {jQuery} tableRow row de table la * @returns {undefined} */function calculateMin(table, tableRow) {    calculate(table, tableRow, false);}/** *  * @param {type} table * @param {type} tableRow * @param {booblean} max * @returns {undefined} */function calculate(table, tableRow, max) {    if (typeof max === "undefined") {        max = true;    }    var indexVaribleEntrante;    var indexVariableSortante;    var trs = table.children("tbody").find("tr");    var ligneZ = $(trs[trs.length - 1]);    var ligneZTds = ligneZ.find("td");    var variableEntrant;    var variableSortant;    //chache variab antran an    var firstLoop = true;    for (var i = 2; i < ligneZTds.length; i++) {        var val = parseFloat($(ligneZTds[i]).text());        //kalkil pou max la        if (max) {            if (val < 0) {                if (firstLoop) {                    variableEntrant = val;                    indexVaribleEntrante = i;                    firstLoop = false;                } else if (val < variableEntrant) {                    variableEntrant = val;                    indexVaribleEntrante = i;                }            }        } else { //kalkil pou min nan            if (val > -1) {                if (firstLoop) {                    variableEntrant = val;                    indexVaribleEntrante = i;                    firstLoop = false;                } else if (val > variableEntrant) {                    variableEntrant = val;                    indexVaribleEntrante = i;                }            }        }    }    //sa vle di ke solisyon an fini    if (typeof variableEntrant === "undefined") {        return;    }    //chache variab sortan an    firstLoop = true;    for (var i = 0; i < trs.length - 1; i++) {        var tr = $(trs[i]);        var tds = tr.find("td");        var valColEntrant = parseFloat($(tds[indexVaribleEntrante]).text());        var valP0 = parseFloat($(tds[1]).text());        var division = valP0 / valColEntrant;        //kalkil pou max lan        if (max) {            if (division > 0) {                if (firstLoop) {                    firstLoop = false;                    indexVariableSortante = i;                    variableSortant = valP0 / valColEntrant;                } else if (division < variableSortant) {                    variableSortant = division;                    indexVariableSortante = i;                }            }        } else { //sino pou Min lan            if (division <= 0) {                if (firstLoop) {                    firstLoop = false;                    indexVariableSortante = i;                    variableSortant = valP0 / valColEntrant;                } else if (division < variableSortant) {                    variableSortant = division;                    indexVariableSortante = i;                }            }        }    }    //sa vle di ke solisyon an fini    if (typeof variableSortant === "undefined") {        return;    }    var newTableRow = cloneTableRow(tableRow);    $("#tables_container").append(newTableRow);    var newTable = newTableRow.find("table");    var newTableTrs = newTable.children("tbody").find("tr");    var tdPivot = $($(newTableTrs[indexVariableSortante]).find("td")[indexVaribleEntrante]).addClass("bg-primary");    var pivotValue = parseFloat(tdPivot.text());    var tableRow3 = cloneTableRow(newTableRow);    $("#tables_container").append(tableRow3);    var table3 = tableRow3.find("table");    //chanje non de kolòn de base la a pivot    var PivotColumnName = $(table3.children("thead").children("tr").find("th")[indexVaribleEntrante]).text();    var table3Trs = table3.children("tbody").children("tr");    var table3PivotLignTds = $(table3Trs[indexVariableSortante]).children("td");    $(table3PivotLignTds[0]).text(PivotColumnName);    for (var i = 1; i < table3PivotLignTds.length; i++) {        var td = $(table3PivotLignTds[i]);        td.removeClass("bg-primary");        var newVal = parseFloat(td.text()) / pivotValue;        td.text(newVal);    }    //kalkile valeur de lot ligne yo    var i = 0;    $.each(table3Trs, function () {        if (i === indexVariableSortante) {            i++;            return;        }        var tds = $(this).children("td");        var pivotColumnVal = parseFloat($(tds[indexVaribleEntrante]).text());        for (var j = 1; j < tds.length; j++) {            var pivotLigneVal = parseFloat($(table3PivotLignTds[j]).text());            var td = $(tds[j]);            var newVal = parseFloat(td.text()) - (pivotColumnVal * pivotLigneVal);            td.text(newVal);        }        i++;    });    calculateMax(table3, tableRow3);}function cloneTableRow(oldTableRow) {    var tableRow3 = oldTableRow.clone();    tableRow3.addClass("marginTop");    tableRow3.find("h1").text("Table " + tableNumber);    tableNumber++;    return tableRow3;}
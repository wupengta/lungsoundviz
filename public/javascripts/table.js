var Table = {
    caseByDayTable: {},
    caseByPartTable: {},
    genCaseByDayTable: async function () {
        Table.caseByDayTable = $('#caseByDayTable').DataTable({

            data: await $.getJSON("/getCaseByDayData?patient_id=" + $("#hPatientId").val() + "&feature=" + $("#select-feature").val()),
            columns: [{
                    data: 'upload_date',
                    title: '日期',
                    render: function (data, type, full) {
                        return moment(data).format("YYYY/MM/DD");
                    }
                },
                {
                    data: 'time',
                    title: '上/下午',
                    render: function (data, type, full) {
                        if (data === "am") {
                            return "上午";
                        } else {
                            return "下午";
                        }
                    }
                },
                {
                    data: 'percentage',
                    title: '嚴重程度',
                    render: function (data, type, full) {
                        return parseInt(data / 6);
                    }
                },
                {
                    data: 'upload_date',
                    title: '',
                    render: function (data, type, full) {
                        return "<button class='btn btn-info btn-sm' onclick='Chart.goTo(&#39;" + moment(data).format("YYYY/MM/DD") + "&#39;)'>前往</button>";
                    }

                }
            ],
            lengthMenu: [
                [5, 10, 20, -1],
                [5, 10, 20, '全部']
            ],
            order: [
                [3, 'desc']
            ],
            displayLength: 5,
            searching: false,
            paging: true,
            info: false,
            pagingType: "full_numbers",
            autoWidth: true,
            language: {
                processing: "處理中...",
                loadingRecords: "載入中...",
                lengthMenu: "顯示_MENU_ 項結果",
                zeroRecords: "沒有符合的結果",
                info: "第 _PAGE_ 頁，共 _PAGES_頁",
                infoEmpty: "共 0 項結果",
                infoFiltered: "(從 _MAX_ 項結果中過濾)",
                search: "搜尋",
                paginate: {
                    first: "首頁",
                    previous: "上一頁",
                    next: "下一頁",
                    last: "末頁"
                }
            }
        });
    },
    genCaseByPartTable: async function () {

        Table.caseByPartTable = $('#caseByPartTable').DataTable({

            data: await $.getJSON("/getCaseByPartData?patient_id=" + $("#hPatientId").val() + "&feature=" + $("#select-feature").val()),
            columns: [

                {
                    data: 'upload_date',
                    title: '日期',
                    render: function (data, type, full) {
                        return moment(data).format("YYYY/MM/DD");
                    }
                },
                {
                    data: 'part',
                    title: '部位',
                    render: function (data, type, full) {
                        if (data === "F1") {
                            return "前1";
                        } else if (data === "F2") {
                            return "前2";
                        } else if (data === "F3") {
                            return "前3";
                        } else if (data === "F4") {
                            return "前4";
                        } else if (data === "B1") {
                            return "後1";
                        } else if (data === "B2") {
                            return "後2";
                        }
                    }
                },
                {
                    data: 'time',
                    title: '上/下午',
                    render: function (data, type, full) {
                        if (data === "am") {
                            return "上午";
                        } else {
                            return "下午";
                        }
                    }
                },
                {
                    data: 'percentage',
                    title: '嚴重程度'
                },
                {
                    data: 'upload_date',
                    title: '',
                    render: function (data, type, full) {
                        return "<button class='btn btn-info btn-sm' onclick='Chart.goTo(&#39;" + moment(data).format("YYYY/MM/DD") + "&#39;)'>前往</button>";
                    },
                    searchable: false,

                }
            ],
            responsive: true,
            columnDefs: [],
            order: [
                [4, 'desc']
            ],
            lengthMenu: [
                [5, 10, 20, -1],
                [5, 10, 20, '全部']
            ],
            displayLength: 5,
            searching: false,
            paging: true,
            info: true,
            pagingType: "full_numbers",
            autoWidth: true,
            language: {
                processing: "處理中...",
                loadingRecords: "載入中...",
                lengthMenu: "顯示_MENU_ 項結果",
                zeroRecords: "沒有符合的結果",
                info: "第 _PAGE_ 頁，共 _PAGES_頁",
                infoEmpty: "共 0 項結果",
                infoFiltered: "(從 _MAX_ 項結果中過濾)",
                search: "搜尋",
                paginate: {
                    first: "首頁",
                    previous: "上一頁",
                    next: "下一頁",
                    last: "末頁"
                }
            }
        });
    },
    updateCaseByDayTable: async function () {

        const caseByDayData = await $.getJSON("/getCaseByDayData?patient_id=" + $("#hPatientId").val() + "&feature=" + $("#select-feature").val());
        Table.caseByDayTable.clear();
        Table.caseByDayTable.rows.add(caseByDayData);
        Table.caseByDayTable.draw();

        const caseByPartData = await $.getJSON("/getCaseByPartData?patient_id=" + $("#hPatientId").val() + "&feature=" + $("#select-feature").val());
        Table.caseByPartTable.clear();
        Table.caseByPartTable.rows.add(caseByPartData);
        Table.caseByPartTable.draw();

    }
}

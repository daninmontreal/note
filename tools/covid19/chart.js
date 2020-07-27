$(() => {
    let addr = "https://santemontreal.qc.ca/fileadmin/fichiers/Campagnes/coronavirus/situation-montreal/courbe.csv";
    addr = "data/courbe.csv";
    d3.csv(addr).then(makeChart);

    function makeChart(courbe) {
        var color = Chart.helpers.color;
        var labels = courbe.map(
            (d) => {
                return d["Date;Nouveaux cas;Cumulatif;"].split(";")[0];
            }
        );
        var datas = courbe.map(
            (d) => {
                return d["Date;Nouveaux cas;Cumulatif;"].split(";")[1];
            });

        var chart = new Chart('chart', {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "New case",
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 1,
                        data: datas,

                    }
                ]
            }
        });
    }
});
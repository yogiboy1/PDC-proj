const {ipcRenderer}=require('electron');
ipcRenderer.on('simulation:start',function (event,data) {
    console.log(data);
    $(function () {
        let $canvas=$('#canvas-container');
        let promises=[];
        let d=[];
        for(let i=0;i<data.sims;i++){
            let $t=$(`<div class="col s12 center-align"><canvas id="image-${i}" class="image"></canvas></div>`);
            $canvas.append($t);
            let canvas = document.querySelector(`#image-${i}`);
            let ctx = canvas.getContext('2d');
            let img = new Image();
            img.onload = function(e){
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img,0,0);
            };
            img.src = data.image;
        }
        function benchmark() {
            for(let i=0;i<data.sims;i++){
                let canvas = document.querySelector(`#image-${i}`);
                let ctx = canvas.getContext('2d');
                let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let w = new Worker('../js/multiWorker.js');
                w.postMessage([data.type,imageData]);
                let tPromise = new Promise((resolve, reject) => {
                    w.onmessage=function(e) {
                        ctx.putImageData(e.data[0], 0, 0);
                        let start=e.data[1];
                        let end=Date.now();
                        let timeTaken=end-start;
                        d.push({start,end,timeTaken});
                        resolve("success");
                    };
                });
                promises.push(tPromise);
            }
        }
        function plotScatter(x){
            let canvas = document.querySelector(`#chart`);
            let ctx = canvas.getContext('2d');
            let plotData=[{
                x:0,
                y:0
            }];
            let startTime=x[0].start;
            for(let i=0;i<x.length;i++){
                let t={
                    x:i+1,
                    y:x[i].end-startTime
                };
                plotData.push(t);
            }
            var scatterChart = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'Multi Thread Performance',
                        data: plotData
                    }]
                },
                options :{
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Time in ms'
                            }
                        }],
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Number of images processed'
                            }
                        }]
                    }
                }
            });
        }
        $('#benchmark').click(function () {
            benchmark();
            $.when.apply(this,promises).then(function () {
                $('#results').removeClass('hide');
                $('#code').html(JSON.stringify(d,null,4));
                plotScatter(d);
                console.log(d);
            })
        });
    });
});
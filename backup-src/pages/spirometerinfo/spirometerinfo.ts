import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FooterProvider } from '../../providers/footer/footer';
import Chart from 'chart.js';


@IonicPage()
@Component({
  selector: 'page-spirometerinfo',
  templateUrl: 'spirometerinfo.html',
})
export class SpirometerinfoPage {
  program : any;
  footer : any;
  weeks = 4;
  present : any;
  absent : any;
  avatar : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public footerCtrl : FooterProvider) {
    this.program = navParams.get("program");
    this.present = navParams.get("present");
    this.absent = navParams.get("absent");
    this.avatar = navParams.get("avatar");

    this.footer = footerCtrl.footer;
  }

  ionViewDidLoad() {
    var ctx = document.getElementById("chart_area");
    var chart_area;

    chart_area = new Chart(ctx, this.chart());
  }

  chart()
  {
    var config = {
      type: 'pie',
      data: {
        datasets: [
          {
            data : [
              this.present, this.absent
            ],
            backgroundColor : [
              'rgb(0,255,0)',
              'rgb(255,0,0)'
            ],
            label: [
              this.program.program + "("+this.present+"/"+this.weeks+")",
              this.program.program 
            ]
          }
        ],
        labels: [
          "Present "  + "("+this.present+"/"+this.weeks+")",
          "Absent " + "("+ (this.weeks - this.present) +"/"+this.weeks+")"
        ]
      },
      options: {
        responsive: true,
				title: {
		            display: true,
		            text: 'Your Attendance this month'
		        },
		        layout: {
		            padding: {
		                left: 0,
		                right: 0,
		                top: 0,
		                bottom: 0
		            }
		        },
		        tooltips: {
				    callbacks: {
				        label: function(item, data) {
				            return data.datasets[item.datasetIndex].label[item.index];
				        }
				    }
				}
      }
    };

    return config;
  }

  goback()
  {
    this.navCtrl.pop();
  }

}

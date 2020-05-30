// load in and process data 
import {
  csv,
  range
} from 'd3';


export const loadAndProcessData = () => 

csv('data.csv')
  .then(data => {
    data.forEach(d => {
      d.date = new Date(d.Date);
      d.year = +d.Year;
      d.year = +d.Year;
      	d.Desconocido = +d.Desconocido;
      	d.ISLAS = +d.ISLAS;
      	d.REPUBLICA = +d.REPUBLICA;
      	d.REPUBLICADEL = +d.REPUBLICADEL;
      	d.REPUBLICADEMOCRATICADEL = +d.REPUBLICADEMOCRATICADEL;
      	d.ALAJUELA = +d.ALAJUELA;
      	d.CARTAGO = +d.CARTAGO;
      	d.GUANACASTE = +d.GUANACASTE;
      	d.HEREDIA = +d.HEREDIA;
      	d.LIMON = +d.LIMON;
      	d.PUNTARENAS = +d.PUNTARENAS;
      	d.SANJOSE = +d.SANJOSE;
      d.BarnardCollege = +d.BarnardCollege;
      	d.BusinessSchool = +d.BusinessSchool;
      	d.DentalMedicine = +d.DentalMedicine;
      	d.PhysiciansSurgeons = +d.PhysiciansSurgeons;
      	d.ColumbiaCollege = +d.ColumbiaCollege;
      	d.GSAPP = +d.GSAPP;
        d.GSAS = +d.GSAS;
				d.GSEAS = +d.GSEAS;
				d.LawSchool = +d.LawSchool;
				d.SEAS = +d.SEAS;
				d.GeneralStudies = +d.GeneralStudies;
				d.SIPA = +d.SIPA;
				d.Journalism = +d.Journalism;
				d.Nursing = +d.Nursing;
				d.SPS = +d.SPS;
				d.PublicHealth = +d.PublicHealth;
				d.SocialWork = +d.SocialWork;
				d.Arts = +d.Arts;
				d.TeachersCollege = +d.TeachersCollege;
				d.UTS = +d.UTS;
      });
  // console.log(data);
    
    return data;
  });
   

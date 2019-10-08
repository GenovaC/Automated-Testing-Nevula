var _ = require('lodash');
require('chromedriver');
const assert = require('assert');
const {Builder, Key, By, until} = require('selenium-webdriver');


describe('Verify Clients DataTable', function () {
    const WAIT_TIME = 3000;
    const WAIT_LONG_TIME = 10000;
    let driver;
    let realUser = "QaTest";
    let realPassword = "Abc.123";
    let statusClient = ["Habilitado", "Deshabilitado"];    
    let typeClient = ["Particular", "Comercial", "Corporativo"];
    let emailRegex = /^([A-Za-z0-9ñÑ\-\_]+(?:\.[A-Za-z0-9ñÑ\-\_]+)*)@((?:[A-Za-z0-9ñÑ\-\_]+\.)*\w[A-Za-z0-9ñÑ\-\_]{0,66})\.([A-Za-z0-9ñÑ\-\_]{2,6}(?:\.[a-z]{2})?)$/i;
    let nameRegex = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ0-9!@#$&()-`.+',/\"\s]+$/;

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();

        await driver.manage().window().maximize(); 
        await driver.get('https://192.168.3.36/login');
        await driver.sleep(WAIT_TIME);  
    });

    after(() => driver && driver.quit());

    it('Login', async function() {
        await driver.findElement(By.name('loginUser')).sendKeys(realUser, Key.RETURN);
        await driver.findElement(By.name('password')).sendKeys(realPassword , Key.RETURN);  
        await driver.findElement(By.name('loginButton')).click();  
        await driver.sleep(WAIT_TIME);    
    });

    it('Access to Clients gestion', async function() {
        //Presionar el menú de Gestión de Cuentas, accediendo a él mediante el "selector" que provee el inspector web
        let accountsMenu = await driver.findElements({css: 'body > div.wrapper.ng-scope > div:nth-child(2) > aside > section > ul > li:nth-child(2)'});
        await accountsMenu[0].click();
        await driver.sleep(WAIT_TIME);
          
        let accountSubmenu = await driver.findElements({css: 'body > div.wrapper.ng-scope > div:nth-child(2) > aside > section > ul > li.treeview.ng-scope.active > ul > li:nth-child(1) > a'});
        accountSubmenu[0].click();
        await driver.sleep(WAIT_TIME);

        let clientsLengthSelect = await driver.findElement(By.name('dataTableClients_length')); //Select de numero de registros del dataTable
        await clientsLengthSelect.click();  
        await driver.sleep(WAIT_TIME);

        //Seleccionar la opción del select para ver 10, 25, 50 (actual) o 100 registros en el DataTable. 
        await clientsLengthSelect.findElement({css: '#dataTableClients_length > label > select > option:nth-child(4)'}).click();
        console.log("Paginación cada 100 registros en la tabla");
        await driver.sleep(WAIT_TIME);
        
    });


    it('Validate Client Data Table', async function() {
        let clientDateTable = await driver.findElement(By.xpath('//*[@id="dataTableClients"]/tbody'));     	
        let nextButton; 
        let continuePaginateFlag;
    	let rows_table;   	
        let rows_count;
        let pageNum = 1;
        let columns_row
        let columns_count
        let columnValue = "";

        do {
            
            console.log("-- Página: "+pageNum+" de la tabla.");
            continuePaginateFlag = false;

            rows_table = await clientDateTable.findElements(By.tagName("tr")); //Obtener las filas de la tabla    	
            rows_count = rows_table.length; //Calcular el número de filas de la tabla
            
            //recorriendo todos los valores visibles en la tabla
            for (var i = 0; i < rows_count; i++) {
                columns_row = await rows_table[i].findElements(By.tagName("td")); //Obtener las columnas de una fila específica 
            
                //Calcular número de columnas/celdas. 
                columns_count = columns_row.length;    
                
                //Recorrer las columnas de una fila específica 
                for (var column = 0; column < columns_count; column++) {
                    columnValue = await columns_row[column].getText().then(function (value) { return value; });

                    switch(column) {
                        case 0:
                            if (!nameRegex.test(columnValue) || _.isNull(columnValue))
                                console.log("NOMBRE del cliente en la FILA " + i + " PÁGINA "+pageNum+" no cumple los estándares: " +columnValue);
                            break;

                        case 1:
                            if (!emailRegex.test(columnValue) || _.isNull(columnValue))
                                console.log("EMAIL del cliente en la FILA " + i + " PÁGINA "+pageNum+" no cumple los estándares: " +columnValue);
                            break;

                        case 2:
                            if (!_.includes(typeClient, columnValue) || _.isNull(columnValue))
                                console.log("TIPO del cliente en la FILA " + i + " PÁGINA "+pageNum+" no cumple los estándares:  "+columnValue);
                            break;

                        case 3:
                            if (!_.includes(statusClient, columnValue) || _.isNull(columnValue))
                                console.log("ESTADO del cliente en la FILA " + i + " PÁGINA "+pageNum+" no cumple los estándares: " +columnValue); 
                            break;

                    }// end switch
                }// end for                
            } //end for                    
            
            nextButton = await driver.findElement({css: '#dataTableClients_next'});   

            //Obtener el valor de la clase del botón siguiente para saber si está deshabilitado (es decir, si hay más registros)
            nextButtonValue = await driver.findElement({css: '#dataTableClients_paginate > ul > li:nth-child(2)'}).getAttribute('class')
                            .then(function (value) {   
                                    return value;           
                            });

            //si el botón de siguiente NO está deshabilitado
            if (!_.isEqual(nextButtonValue, "disabled"))  {
                continuePaginateFlag = true;
                
                await nextButton.click();        
                await driver.sleep(WAIT_LONG_TIME);
                pageNum++;
            }

        }  while (continuePaginateFlag);
        console.log("Completada revisión del DataTable de Clientes");
    });

})
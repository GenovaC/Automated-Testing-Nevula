var _ = require('lodash');
require('chromedriver');
const assert = require('assert');
const {Builder, Key, By, until} = require('selenium-webdriver');


describe('Verify Clients DataTable', function () {
    const WAIT_TIME = 3000;
    let driver;
    let realUser = "gcastillo";
    let realPassword = "Abc.123";
    let statusClient = ["Habilitado", "Deshabilitado"];    
    let typeClient = ["Particular", "Comercial", "Corporativo"];
    let emailRegex = /^([A-Za-z0-9ñÑ\-\_]+(?:\.[A-Za-z0-9ñÑ\-\_]+)*)@((?:[A-Za-z0-9ñÑ\-\_]+\.)*\w[A-Za-z0-9ñÑ\-\_]{0,66})\.([A-Za-z0-9ñÑ\-\_]{2,6}(?:\.[a-z]{2})?)$/i;
    let nameRegex = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ0-9!@#$&()-`.+,/\"\s]+$/;

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

        //Seleccionar la opción del select para ver 10, 25, 50 (actual) o 100 registros en el DataTable
        await clientsLengthSelect.findElement({css: '#dataTableClients_length > label > select > option:nth-child(3)'}).click();
        await driver.sleep(WAIT_TIME);
    });

    it('Validate Client Data Table', async function() {
        let clientDateTable = await driver.findElement(By.xpath('//*[@id="dataTableClients"]/tbody'));     	
    	let rows_table = await clientDateTable.findElements(By.tagName("tr")); //Obtener las filas de la tabla    	
        let rows_count = rows_table.length; //Calcular el número de filas de la tabla
        
    	//recorriendo todos los valores visibles en la tabla
    	for (var i = 0; i < rows_count; i++) {
            let  columns_row = await rows_table[i].findElements(By.tagName("td")); //Obtener las columnas de una fila específica 
    	
    	    //Calcular número de columnas/celdas. 
            let columns_count = columns_row.length;    
            
    	    //Recorrer las columnas de una fila específica 
    	    for (var column = 0; column < columns_count; column++) {
                switch (column) {
                    //Ejecución para el caso del Nombre del cliente
                    case 0: 
                        columns_row[column].getText().then(function (value) {            
                            try { 
                                if (!nameRegex.test(value))
                                    console.log("NOMBRE del cliente en la FILA " + i + " no cumple los estándares: " +value);   
                            } catch (err) {
                                console.log('Error en el NOMBRE del cliente de la fila '+i+' paginando cada 10 registros: '+err);  
                            }
                        });
                        break;

                    //Ejecución para el caso del Email del Cliente
                    case 1:
                        columns_row[column].getText().then(function (value) {                                 
                            try { 
                                if (!emailRegex.test(value))
                                    console.log("EMAIL del cliente en la FILA " + i + " no cumple los estándares: " +value);      
                                
                            } catch (err) {
                                console.log('Error en el EMAIL del cliente de la fila '+i+' paginando cada 10 registros: '+err);  
                            }
                        });
                        break;

                    //Ejecución para el caso del Tipo del Cliente
                    case 2:
                        columns_row[column].getText().then(function (value) {            
                            try { 
                                if (!_.includes(typeClient, value)){
                                    console.log("TIPO del cliente en la FILA " + i + " no cumple los estándares:  "+value); 
                                }
                            } catch (err) {
                                console.log('Error en el TIPO del cliente de la fila '+i+' paginando cada 10 registros: '+err);  
                            }
                        });
                        break;

                    //Ejecución para el caso del Estatus del Cliente
                    case 3:
                        columns_row[column].getText().then(function (value) {            
                            try {   
                                if (!_.includes(statusClient, value)){
                                    console.log("ESTADO del cliente en la FILA " + i + " no cumple los estándares: " +value); 
                                }
                            } catch (err) {
                                console.log('Error en el ESTADO del cliente de la fila '+i+' paginando cada 10 registros: '+err);    
                            }
                        });
                        break;
                } //switch end

    	    }// end for
    	    
        } //end for
    });

})
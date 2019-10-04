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
        
        //obtener el nombre de usuario que se muestra en la ventana principal de la Web administrativa de la Netbox, 
        //mediante el "selector" que provee el inspector web para ese elemento
        let username = await driver.findElements({css: 'body > div.wrapper.ng-scope > div:nth-child(1) > header > nav > div > ul > li:nth-child(2) > a'});
        username[0].getText().then(function (value) {            
            try {
                assert.strictEqual(value, 'Génova Castillo', 'El nombre de usuario no corresponde al usuario ingresado');   
                console.log("Nombre del usuario que inició sesión: "+value);   
            } catch (err) {
                console.log('Evento Inesperado: '+err);  
            }
        });       
    });

    it('Access to Clients gestion', async function() {
        //Presionar el menú de Gestión de Cuentas, accediendo a él mediante el "selector" que provee el inspector web
        let accountsMenu = await driver.findElements({css: 'body > div.wrapper.ng-scope > div:nth-child(2) > aside > section > ul > li:nth-child(2)'});
        await accountsMenu[0].click();
        await driver.sleep(WAIT_TIME);
          
        let accountSubmenu = await driver.findElements({css: 'body > div.wrapper.ng-scope > div:nth-child(2) > aside > section > ul > li.treeview.ng-scope.active > ul > li:nth-child(1) > a'});
        accountSubmenu[0].click();
        await driver.sleep(WAIT_TIME);

        /*await driver.getCurrentUrl().then(function (value) {            
            try {
                assert.strictEqual(value, 'https://192.168.3.36/management/clients', 'La sesión no se encuentra en la ruta adecuada');   
                console.log("Ubicación actual: "+value);   
            } catch (err) {
                console.log('Evento Inesperado: '+err);  
            }
        });   */

    });

    it('Access to Client', async function() {
        let clientsTable = await driver.findElement(By.xpath('//*[@id="dataTableClients"]/tbody')); 
    	//Obtener las filas de la tabla
    	let rows_table = await clientsTable.findElements(By.tagName("tr"));
    	//Calcular el número de filas de la tabla
        let rows_count = rows_table.length;
        
    	//Loop will execute till the last row of table.
    	for (var i = 0; i < rows_count; i++) {
    	    //Recorrer las columnas de una fila específica 
            let  Columns_row = await rows_table[i].findElements(By.tagName("td"));

    	    //Calcular número de columnas/celdas. Se le resta uno para descontar la columna con botones
            let columns_count = Columns_row.length;    
            console.log("-------------------------------------------------- ");         
            console.log("número de columnas en la fila " + i + " son: " + columns_count);
            
    	    //Loop will execute till the last cell of that specific row.
    	    for (var column = 0; column < columns_count; column++) {

                switch (column) {
                    case 0:
                        Columns_row[column].getText().then(function (value) {            
                        try { 
                            console.log("NOMBRE del cliente en la FILA " + i + ": " +value);   
                        } catch (err) {
                            console.log('Error en el NOMBRE del cliente de la fila '+i+' paginando cada 10 registros: '+err);  
                        }
                        });
                        break;

                    case 1:
                        Columns_row[column].getText().then(function (value) {     
                            // regex con el que revisan los emails de nevula /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i        
                        try { 
                            console.log("EMAIL del cliente en la FILA " + i + ": " +value);    
                        } catch (err) {
                            console.log('Error en el CLIENTE del cliente de la fila '+i+' paginando cada 10 registros: '+err);  
                        }
                        });
                        break;

                    case 2:
                        Columns_row[column].getText().then(function (value) {            
                        try { 
                            if (!_.includes(typeClient, value)){
                                console.log("TIPO del cliente en la FILA " + i + ": " +value); 
                            }
                        } catch (err) {
                            console.log('Error en el TIPO del cliente de la fila '+i+' paginando cada 10 registros: '+err);  
                        }
                        });
                        break;

                    case 3:
                        Columns_row[column].getText().then(function (value) {            
                        try {   
                            if (!_.includes(statusClient, value)){
                                console.log("ESTADO del cliente en la FILA " + i + ": " +value); 
                            }
                        } catch (err) {
                            console.log('Error en el ESTADO del cliente de la fila '+i+' paginando cada 10 registros: '+err);    
                        }
                        });
                        break;
                }
    	    }
    	    
        }
    });

})
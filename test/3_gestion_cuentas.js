require('chromedriver');
const assert = require('assert');
const {Builder, Key, By, until} = require('selenium-webdriver');


describe('Verify login with incorrect credentials', function () {
    const WAIT_TIME = 3000;
    let driver;
    let realUser = "gcastillo";
    let realPassword = "Abc.123";

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

    it('Access to Accounts gestion', async function() {
        //Presionar el menú de Gestión de Cuentas, accediendo a él mediante el "selector" que provee el inspector web
        let accountsMenu = await driver.findElements({css: 'body > div.wrapper.ng-scope > div:nth-child(2) > aside > section > ul > li:nth-child(2)'});
        await accountsMenu[0].click();
        await driver.sleep(WAIT_TIME);
          
        let accountSubmenu = await driver.findElements({css: 'body > div.wrapper.ng-scope > div:nth-child(2) > aside > section > ul > li.treeview.ng-scope.active > ul > li:nth-child(1) > a'});
        accountSubmenu[0].click();
        await driver.sleep(WAIT_TIME);

        await driver.getCurrentUrl().then(function (value) {            
            try {
                assert.strictEqual(value, 'https://192.168.3.36/management/clients', 'La sesión no se encuentra en la ruta adecuada');   
                console.log("Ubicación actual: "+value);   
            } catch (err) {
                console.log('Evento Inesperado: '+err);  
            }
        });   
        
    });

})
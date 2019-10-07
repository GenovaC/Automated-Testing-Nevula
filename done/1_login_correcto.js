require('chromedriver');
const assert = require('assert');
const {Builder, Key, By, until} = require('selenium-webdriver');


describe('Initiate Session on Nevula', function () {
    let driver;
    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().window().maximize(); 
        await driver.get('https://192.168.3.36/login');
        await driver.sleep(5000);  
    });
    
    after(() => driver && driver.quit() );
        
    it('Set username', async function() {    
        await driver.findElement(By.name('loginUser')).sendKeys('gcastillo', Key.RETURN);  
        console.log('Ingresé el usuario');
    });

    it('Set password', async function(){
        await driver.findElement(By.name('password')).sendKeys('Abc.123', Key.RETURN);
        console.log('Ingresé la contraseña');
    });

    it('Login', async function(){
        await driver.findElement(By.name('loginButton')).click();
        await driver.sleep(3000);
        console.log("Inicié Sesión");       

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

    it('Logout', async function(){
        //obtener el botón de 'cerrar sesión' la Netbox, mediante el "selector" que provee el inspector web para ese elemento
        let links = await driver.findElements({css:'body > div.wrapper.ng-scope > div:nth-child(1) > header > nav > div > ul > div > ul > li:nth-child(3) > a'});
        links[0].click();

        console.log("Cerré sesión");           
        await driver.sleep(3000);
    });

})
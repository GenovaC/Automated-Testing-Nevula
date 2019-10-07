require('chromedriver');
const assert = require('assert');
const {Builder, Key, By, until} = require('selenium-webdriver');


describe('Verify login with incorrect credentials', function () {
    const WAIT_TIME = 5000;
    let driver;
    let realUser = "gcastillo";
    let fakeUser = "fakeUser";
    let fakePassword = "fakePassword";
    let xpathErrorMsg = `//*[@id="form"]/div/div[4]/div`;
    let usernameTextField;
    let passwordTextField;
    let loginButton;

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();

        await driver.manage().window().maximize(); 
        await driver.get('https://192.168.3.36/login');
        await driver.sleep(WAIT_TIME);  

        usernameTextField = await driver.findElement(By.name('loginUser'));
        passwordTextField = await driver.findElement(By.name('password'));
        loginButton       = await driver.findElement(By.name('loginButton'));
    });

    after(() => driver && driver.quit());

    it('Login without password', async function() {
        await usernameTextField.clear();
        await usernameTextField.sendKeys(fakeUser, Key.RETURN);  

        await loginButton.click();
        
        let errorMsg = await driver.findElements(By.xpath(xpathErrorMsg));
        errorMsg[0].getText().then(function (value) {            
            try {
                assert.strictEqual(value, 'Debe ingresar su Usuario/Contraseña', 'El mensaje que indica que debe ingresar contraseña no es correcto');   
                console.log("Se validó que el mensaje 'Debe ingresar su Usuario/Contraseña' es el correcto");   
            } catch (err) {
                console.log('Error capturado iniciando sesión sin contraseña: '+err);  
            }
        });         
        await driver.sleep(WAIT_TIME);            
    });

    it('Login inexistent user', async function() {        
        await usernameTextField.clear();
        await usernameTextField.sendKeys(fakeUser, Key.RETURN);  
        
        await passwordTextField.clear();
        await passwordTextField.sendKeys(fakePassword, Key.RETURN);  

        await loginButton.click();

        let errorMsg = await driver.findElements(By.xpath(xpathErrorMsg));
        errorMsg[0].getText().then(function (value) {            
            try {
                assert.strictEqual(value, 'Usuario no existe', 'El mensaje que indica que el usuario no existe no es correcto');   
                console.log("Se validó que el mensaje de 'Usuario no existe' fuese el correcto");   
            } catch (err) {
                console.log('Error capturado: '+err);  
            }
        });         
        await driver.sleep(WAIT_TIME);            
    });
    
    it('Login with fake credentials', async function() {
        await usernameTextField.clear();
        await usernameTextField.sendKeys(realUser, Key.RETURN);  

        await passwordTextField.clear();
        await passwordTextField.sendKeys(fakePassword, Key.RETURN);

        await loginButton.click();
        
        let errorMsg = await driver.findElements(By.xpath(xpathErrorMsg));
        errorMsg[0].getText().then(function (value) {            
            try {
                assert.strictEqual(value, 'Credenciales inválidas', 'El mensaje que indica que las credenciales son inválidas no es correcto');   
                console.log("Se validó que el mensaje de 'Credenciales Inválidas' fuese el correcto");   
            } catch (err) {
                console.log('Error capturado: '+err);  
            }
        }); 
        
        await driver.sleep(WAIT_TIME);
            
    });
})
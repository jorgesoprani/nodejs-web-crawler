module.exports = {
    preSearch: () => {
        document.querySelector('#lgpd-accept')?.click()
        return 'teste';
    }
}
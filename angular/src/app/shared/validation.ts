export class CustomValidator {
    // Validates URL
    static ipValidator(ip): any {
        if (ip.pristine) {
            return null;
        }
        const regex = /^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$/gm;
        ip.markAsTouched();
        if (regex.test(ip.value)) {
            return null;
        }
        return {
            invalidIp: true
        };
    }
}
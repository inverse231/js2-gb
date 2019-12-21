const regexp1 = new RegExp("\'", "gmi");
const regexp2 = new RegExp("\\B'|'\\B", "gm");
let string = document.querySelector(".text");
const btn = document.querySelector('.filter-quotes');

btn.addEventListener('click', () => {
    // string.textContent = string.textContent.replace(regexp1, "\"");
    console.log(string.textContent.match(regexp2));
    string.textContent = string.textContent.replace(regexp2, '\"');
});

class FormValidator {
    constructor(form) {
        this.form = form;
        this.patterns = {
            name: /^[A-zА-я]+$/i,
            phone: /^\+7\(\d{3}\)(\d{3})-(\d{4})/g,
            email: /^[\w._-]+@\w+\.[a-z]{2,4}$/i
        };
        this.errors = {
            name: "Name must content only letters",
            phone: "Phone must be +7(000)000-0000",
            email: "Email must content letters, - and _"
        };
        this.errorClass = 'error-msg';
        this.valid = false;
        this.checkFields();
    }

    checkFields() {
        const errors = [...document.querySelectorAll(`${this.errorClass}`)];
        errors.forEach(error => {
            error.remove();
        });

        const elements = [...this.form.querySelectorAll('input')];
        elements.forEach(element => {
            this.validate(element);
        });

        const invalidInputs = [... this.form.querySelectorAll('.invalid')];
        if(invalidInputs.length) {
            this.valid = true;
        }
    }

    validate(field) {
        if (this.patterns[field.name]) {
            if(!this.patterns[field.name].test(field.value)){
                field.classList.add('invalid');
                this.addErrorMessage(field);
                this.watch(field);
            }
        }
    }

    addErrorMessage(field) {
        const errorStr = `<div class="${this.errorClass}">${this.errors[field.name]}</div>`;
        field.parentNode.insertAdjacentHTML('beforeend', errorStr);
    }

    watch(field){
        field.addEventListener('input', () => {
            const error = field.parentNode.querySelector('.error-msg');
            if(this.patterns[field.name].test(field.value)) {
                field.classList.remove('invalid');
                field.classList.add('valid');
                if(error) {
                    error.remove();

                }
            } else {
                field.classList.remove('valid');
                field.classList.add('invalid');
                if(!error){
                    this.addErrorMessage(field);
                }
            }
        });
    };
}
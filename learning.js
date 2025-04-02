//some tests for learning the syntax of JavaScript


//function
function testString() {
    return 'test!';
}
console.log(testString());

//arrow function
const testFunc2 = () => {
    return 'test2!';
}
console.log(testFunc2());

//plain object
const obj = {
    name: 'John',
    age: 20,
    getDetails: function() {
        return this.name + ' is ' + this.age + ' years old.';
    },
};
console.log(obj.getDetails());
obj.name = 'Jane';
console.log(obj.getDetails());

//arrays and iterators
const numbers = [1, 2, 3, 4, 5];
console.log(numbers);
numbers[0] = 10;
console.log(numbers);

for (let i = 0; i < numbers.length; i++) {
    console.log(++numbers[i]);
}

for (const number of numbers) {
    console.log(number);
}

let i = 0;
while (i < numbers.length){
    console.log(numbers[i++]);
}


//classes
class Person {
    #_name;
    #_age;
    constructor(name, age)
    {
        this.#_name = name;
        this.#_age = age;
    }
    getDetails() {
        return `${this.#_name} is ${this.#_age} years old.`;
    }
}

// Inheritance
class Employee extends Person {
    constructor(name, age, position) {
        super(name, age);
        this.position = position;
    }
    getDetails() {
        return super.getDetails() + ` They work as a ${this.position}.`;
    }
}
const employee = new Employee('Jeroen', 35, 'Developer');
console.log(employee.getDetails());

console.log(employee.getDetails());
const person = new Person('Jane', 30);
person.jagioad = 'Doe';
console.log(person.getDetails());
console.log(person.jagioad);
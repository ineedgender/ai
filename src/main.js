
function sum(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function natural_log(a) {
  Math.log(a);
}

function abs(a) {
  Math.abs(a);
}

function exp(a) {
  Math.exp(a);
}

function not(a) {
  if (a) {
    return false;
  } else {
    return true;
  }
}

function bernoulli(p) {
  if (p < 0 || p > 1) {
    throw "Invalid p in bernoulli.";
  }
  
  if (Math.random() < p) {
    return true;
  } else {
    return false;
  }
}

function uniformcontinuous01() {
  return Math.random();
}

function uniformdiscrete(min, max) {
  if (min > max) {
    throw "Invalid min-max in uniformdiscrete.";
  }
  
  if (min == max) {
    return min;
  }
  
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

int_primitive_functions = {
  'sum': {input: ['int', 'int'], implementation: sum},
  'subtract': {input: ['int', 'int'], implementation: subtract},
  'multiply': {input: ['int', 'int'], implementation: multiply},
  'float_to_int': {input: ['float'], implementation: function(a) { return Math.round(a); }},
  'abs': {input: ['int'], implementation: abs},
  'uniformdiscrete': {input: ['int', 'int'], implementation: uniformdiscrete},
};

float_primitive_functions = {
  'sum': {input: ['float', 'float'], implementation: sum},
  'subtract': {input: ['float', 'float'], implementation: subtract},
  'multiply': {input: ['float', 'float'], implementation: multiply},
  'int_to_float': {input: ['int'], implementation: function(a) { return a; } },
  'natural_log': {input: ['float'], implementation: natural_log},
  'natural_log': {input: ['positive_float'], implementation: natural_log},
  'abs': {input: ['float'], implementation: abs},
  'exp': {input: ['float'], implementation: exp},
  'uniformcontinuous01': {input: [], implementation: uniformcontinuous01},
};

// Let us show that we can introduce special types
// to decrease the number of program failures.
positive_float_primitive_functions = {
  'exp': {input: ['float'], implementation: exp},
  'exp': {input: ['positive_float'], implementation: exp},
}

bool_primitive_functions = {
  'not': {input: ['bool'], implementation: not},
  'and': {input: ['bool', 'bool'], implementation: 'SPECIAL_AND'},
  'or': {input: ['bool', 'bool'], implementation: 'SPECIAL_OR'},
  'bernoulli': {input: ['float'], implementation: bernoulli},
}

TYPE1_primitives_functions = {
  'if': {input: ['bool', '<TYPE>', '<TYPE>'], implementation: 'SPECIAL_IF'},
}

primitive_functions = {
  'int': int_primitive_functions,
  'float': float_primitive_functions,
  'positive_float': positive_float_primitive_functions,
  'bool': bool_primitive_functions,
  '<TYPE>': TYPE1_primitives_functions
};

function get_random_element(list) {
  return list[uniformdiscrete(0, list.length - 1)];
}

random_constant_generators = {
  'int': function() { return uniformdiscrete(-10, 10); },
  'float': uniformcontinuous01,
  'bool': function() { return bernoulli(0.5); },
  'positive_float': function() { return Math.exp(uniformcontinuous01()); },
}

function sample_procedure_helper(sampled_expr, output_type) {
  
}

function sample_procedure(output_type) {
  if (bernoulli(0.5)) {
    var operator_name = get_random_element(Object.keys(primitive_functions[output_type]));
    var returning_procedure = [operator_name];
    var operator_data = primitive_functions[output_type][operator_name];
    var operands = operator_data['input'];
    for (operand_index in operands) {
      operand = operands[operand_index];
      returning_procedure.push(sample_procedure(operand));
    }
    return returning_procedure;
  } else if (bernoulli(0.5)) {
    var operator_name = get_random_element(Object.keys(primitive_functions['<TYPE>']));
    var returning_procedure = [operator_name];
    var operator_data = primitive_functions[output_type][operator_name];
    var operands = operator_data['input'];
    for (operand_index in operands) {
      operand = operands[operand_index];
      returning_procedure.push(sample_procedure(output_type));
    }
    return returning_procedure;
  } else {
    return (random_constant_generators[output_type])();
  }
}

function wr(text) {
  document.getElementById('mydiv').innerHTML += text;
  document.getElementById('mydiv').innerHTML += '<hr>';
}

for (index = 0; index < 10; index++) {
  wr(JSON.stringify(sample_procedure('int')));
}







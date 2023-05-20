
onmessage = (e) => {
    run_bf_code(e.data.user_code_str, e.data.user_input_str);
};


function run_bf_code(user_code_str, user_input_str) {
    let user_input_index = 0;
    let memory = new Uint8Array(30_000);
    let pointer_pos = 0;
    
    ensure_correct_braces(user_code_str);
    let bf_code = "";
    for(let i = 0; i < user_code_str.length; i++) {
    	switch(user_code_str[i]) {
            case '[':
            	bf_code += "while(memory[pointer_pos] !== 0) {";
            	break;
            case ']':
            	bf_code += "}";
            	break;
            case '.':
            	bf_code += "postMessage(String.fromCharCode(memory[pointer_pos]));";
            	break;
            case ',':
                bf_code += `if(user_input_index < user_input_str.length) {
                    memory[pointer_pos] = user_input_str[user_input_index].charCodeAt();
                    user_input_index++;
                }`
            	break;
            case '+':
                let num_concurrent_additions = 1;
                for(let j = i+1; j < user_code_str.length; j++) {
                    if(user_code_str[j] != '+') {
                    	i=j-1;
                    	break;
                    }
                	num_concurrent_additions++;
                }
                bf_code += `memory[pointer_pos] += ${num_concurrent_additions};`;
                
                break;
            case '-':
                let num_concurrent_subtractions = 1;
                for(let j = i+1; j < user_code_str.length; j++) {
                    if(user_code_str[j] != '-') {
                    	i=j-1;
                    	break;
                    }
                    num_concurrent_subtractions++;
                }
                bf_code += `memory[pointer_pos] -= ${num_concurrent_subtractions};`;
                break;
            case '>':
                let num_concurrent_moves_right = 1;
                for(let j = i+1; j < user_code_str.length; j++) {
                    if(user_code_str[j] != '>') {
                    	i=j-1;
                    	break;
                    }
                    num_concurrent_moves_right++;
                }
                bf_code += `pointer_pos = (pointer_pos + ${num_concurrent_moves_right}) % 30_000;`;
                break;
            case '<':
                let num_concurrent_moves_left = 1;
                for(let j = i+1; j < user_code_str.length; j++) {
                    if(user_code_str[j] != '<') {
                        i=j-1;
                        break;
                    }
                    num_concurrent_moves_left++;
                }
                bf_code += `pointer_pos = (pointer_pos - ${num_concurrent_moves_left}) % 30_000;`;
                break;
    	}
    }
    
    // how secure is this?
    eval(bf_code);
    
    
    function ensure_correct_braces(user_code_str) {
        let counter = 0;
        for(let i = 0; i < user_code_str.length; i++) {
            switch(user_code_str[i]) {
                case '[':
                    counter++;
                    break;
                case ']':
                    if(counter === 0) {
                        document.getElementById("output").value = `unexpected closing bracket at the ${i+1}th character!`;
                        //throw new Error(`unexpected closing bracket at the ${i+1}th character!`);
                    }
                    counter--;
                    break;
            }
    	}
        if(counter > 0) {
            document.getElementById("output").value = `incorrect combination of braces! missing ${counter} closing braces`;
            //throw new Error(`incorrect combination of braces! missing ${counter} closing braces`);
    	}
    }
}
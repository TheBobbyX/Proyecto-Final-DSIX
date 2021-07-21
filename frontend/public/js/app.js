(() => {
    const App = {

        htmlElements: {
            loginForm: document.getElementById('form-login'),
            //mainTaskList: document.querySelector('.main-task-list'),
        },
        init: () => {
            //console.log("hola");
           // App.initializeData.tasks();
            App.bindEvents();
            
        },
        bindEvents: () => {
            App.htmlElements.loginForm.addEventListener('submit', App.events.onLogin);
            //App.htmlElements.mainTaskList.addEventListener('click', App.events.tasksTableDeleteUpdate);
            
        },
        initializeData: {
            tasks: async () => {
                const { count, data } = await App.utils.fetch('http://localhost:4000/api/v1/tasks/',
                { 
                    method: 'GET'
                });
                data.forEach(task => {
                    App.utils.addTaskToTable(task);
                });
            }
        },
        events: {
            onLogin: async (event) => {
                event.preventDefault();
                const { user: vuser, password: vpassword} = event.target.elements;
                const userValue = vuser.value;
                const passwordValue = vpassword.value;
                if(userValue!=""){
                    await App.utils.fetch('http://localhost:4000/api/v1/users/login/',
                    { 
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "email": userValue,
                            "password": passwordValue
                        }),
                        redirect: 'follow'
                    });
                }
            },
           /* tasksTableDeleteUpdate: async (event) =>{
                event.preventDefault();
                if(event.target.id == "Delete"){
                    const id = event.target.parentNode.id;
                    await App.utils.fetch('http://localhost:4000/api/v1/tasks/'+id,
                    {
                        method: 'DELETE'
                    });
                    App.htmlElements.mainTaskList.innerHTML="";
                    App.initializeData.tasks();
                }else if(event.target.id == "Check"){
                    const id = event.target.parentNode.id;
                    const { data } = await App.utils.fetch('http://localhost:4000/api/v1/tasks/'+id,
                    {
                        method: 'GET'
                    });
                    if(data.completed){
                        await App.utils.fetch('http://localhost:4000/api/v1/tasks/'+id,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "name": data.name,
                                "type": data.type,
                                "completed": false
                            }),
                            redirect: 'follow'
                        });
                    }else if(!data.completed){
                        await App.utils.fetch('http://localhost:4000/api/v1/tasks/'+id,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "name": data.name,
                                "type": data.type,
                                "completed": true
                            }),
                            redirect: 'follow'
                        });
                    }
                    App.htmlElements.mainTaskList.innerHTML="";
                    App.initializeData.tasks();
                }else if(event.target.id == "Update"){
                    const id = event.target.parentNode.id;
                    App.update = true;
                    App.idTask = id;
                    const { data } = await App.utils.fetch('http://localhost:4000/api/v1/tasks/'+id,
                    {
                        method: 'GET'
                    });
                    App.htmlElements.taskForm.elements.task.value = data.name;
                    App.htmlElements.taskForm.elements.tasktype.value = data.type;
                    App.utils.disabledElementsList(true);                    
                }
            },*/
        
        },
        
        utils: {
            fetch: async (url, options) => {
                const requestOptions = options;
                const response = await fetch(url, requestOptions);
                return response.json();
                 
            },
            addTaskToTable: ({_id, name, type, completed}) => {
                if(completed){
                    App.htmlElements.mainTaskList.innerHTML += `<div id=${_id}><label name='type' for="">${type}</label><br><button id='Check' style="background-color:black;"></button><label for="" style="text-decoration:line-through;">${name}</label><button id='Update' disabled>Editar</button><button id='Delete'>Eliminar</button></div>`;
                }else{
                    App.htmlElements.mainTaskList.innerHTML += `<div id=${_id}><label name='type' for="">${type}</label><br><button id='Check' style="background-color:grey;"></button><label for="" style="text-decoration:none;">${name}</label><button id='Update'>Editar</button><button id='Delete'>Eliminar</button></div>`;
                } 
            },
            disabledElementsList:(select) =>{
                var nodes = App.htmlElements.mainTaskList.getElementsByTagName('*');
                if(select){
                    for(var i = 0; i < nodes.length; i++){
                         nodes[i].disabled = true;
                    }
                }else if(!select){
                    for(var i = 0; i < nodes.length; i++){
                        nodes[i].disabled = false;
                   }
                }     
            }
        }
    };
    App.init();
})();
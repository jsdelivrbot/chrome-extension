
var globalInput={
        onDocumentLoaded:function(){
              this.contentContainer=document.getElementById('content');
              var globalInputButton = document.getElementById('enableGlobalInput');
              globalInputButton.addEventListener("click", this.onEnableButtonClicked.bind(this));
        },
        onEnableButtonClicked:function(){
            chrome.tabs.query({active: true, currentWindow: true}, this.enableGlobalInputOnTab.bind(this));
        },
        enableGlobalInputOnTab:function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "enable"}, this.processEnableGlobalInputOnTabResponse.bind(this));
        },
        processEnableGlobalInputOnTabResponse:function(response){
              if(!response){
                      this.onTabConnectionFailed();
              }
              else if(response.success){
                      this.hostname=response.hostname;
                      this.onTabGlobalInputEnabled();
              }
              else{
                      this.hostname=response.hostname;
                      this.onTabGlobalInputFailed(response);
              }
        },
        onTabConnectionFailed:function(){
            this.contentContainer.innerHTML="Unable to communicate with the page content, please reload/refresh the page and try again.";
        },
        onTabGlobalInputEnabled:function(response){
            var messageContainer=document.getElementById('message');
            messageContainer.innerHTML="Global Input is now enabled! The page should be displaying a QR Code. Now you can scan it with the Global Input App on your mobile to connect to the page";
        },
        onTabGlobalInputFailed:function(response){
             this.contentContainer.innerHTML="";
             var messageElement=this.createMessageElement(response.error+". You can modify the script to add the support to the Sign In form if you are familiar with JavaScript or we can add it if you can contact me on dilshat@iterativesolution.co.uk. Or you can scan the following the QR code with the Global Input app on your mobile to transfer the content to here first and then do copy and paste operations. ");
             this.contentContainer.appendChild(messageElement);

             this.globalInputConnector=this.createGlobalInputConnector();
             var codeData=this.globalInputConnector.buildInputCodeData();//Get the QR Code value generated that includes the end-to-end encryption key and the other information necessary for the app to establish the communication
             console.log("code data:[["+codeData+"]]");
             var qrCodeContainerElement=this.createQRCode(codeData);
             this.contentContainer.appendChild(qrCodeContainerElement);
             document.body.style.height="600px";

        },


        createMessageElement:function(message){
              var messageContainer = document.createElement('div');
              messageContainer.id="message";
              messageContainer.innerHTML=message;
              return messageContainer;
        },

        createQRCode:function(qrCodedata){

            var qrCodeContainer = document.createElement('div');
            qrCodeContainer.id="qrcode"; //this is where the QR code will be generated
            qrCodeContainer.style.display='flex';
            qrCodeContainer.style['display-direction']='row';
            qrCodeContainer.style['justify-content']='center';
            qrCodeContainer.style['z-index']=1000;
            qrCodeContainer.textContent = '';
            var qrcode = new QRCode(qrCodeContainer, {
                          text: qrCodedata,
                          width:300,
                          height: 300,
                          colorDark : "#000000",
                          colorLight : "#ffffff",
                          correctLevel : QRCode.CorrectLevel.H
                       });

            return qrCodeContainer;
        },
        createGlobalInputConnector:function(){
                  var globalInputConfig=this.buildGlobalInputConfig();

                  var globalInputApi=require("global-input-message"); //get the Global Input Api
                  var globalInputConnector=globalInputApi.createMessageConnector(); //Create the connector
                  globalInputConnector.connect(globalInputConfig);  //connect to the proxy.
                  return globalInputConnector;
        },
        buildGlobalInputConfig:function(){
              var globalinputConfig={
                                onSenderConnected:this.onSenderConnected.bind(this),
                                onSenderDisconnected:this.onSenderDisconnected.bind(this),
                                initData:{
                                      form:{
                                              id:    "###username###"+"@"+this.hostname, // unique id for saving the form content on mobile automating the form-filling process.
                                              title: "Sign In on "+this.hostname,  //Title of the form displayed on the mobile
                                              fields:[{
                                                  label:"Username",
                                                  id:"username",
                                                  operations:{
                                                        onInput:this.onInputUsername.bind(this)
                                                   }
                                              },{
                                                  label:"Password",
                                                  id:"password",
                                                  operations:{
                                                        onInput:this.onInputPassword.bind(this)
                                                  }
                                              }]
                                          }
                                    }
               };
               return globalinputConfig;
        },

        onSenderConnected:function(){
              this.createInputForm();
        },
        createInputForm:function(){
              var formContainer = document.createElement('div');
              formContainer.id="form";

                  var inputContainer=document.createElement('div');
                  inputContainer.className = "field";
                      var labelElement = document.createElement('label');
                      labelElement.innerHTML="<b>Username</b>";
                  inputContainer.appendChild(labelElement);
                      this.usernameElement = document.createElement('input');
                      this.usernameElement.id="username";
                      this.usernameElement.type="text";
                      this.usernameElement.value = '';
                      this.usernameElement.placeholder = 'Enter Username';
                   inputContainer.appendChild(this.usernameElement);


                       var copyButtonElement = document.createElement('button');
                       var messageElement = document.createElement('div');

                       copyButtonElement.id="copyusername";
                       messageElement.id="usernamemessage";

                       copyButtonElement.innerHTML="Copy to Clipboard";
                       messageElement.innerHTML="";
                       var that=this;
                       copyButtonElement.onclick=function(){
                              that.usernameElement.select();
                              document.execCommand("Copy");
                              messageElement.innerHTML="Username value is copied to clipboard";
                       };
                    inputContainer.appendChild(copyButtonElement);
                    inputContainer.appendChild(messageElement);


             formContainer.appendChild(inputContainer);
                   var inputContainer=document.createElement('div');
                   inputContainer.className = "field";
                       var labelElement = document.createElement('label');
                       labelElement.innerHTML="<b>Password</b>";
                   inputContainer.appendChild(labelElement);
                       this.passwordElement = document.createElement('input');
                       this.passwordElement.id="password";
                       this.passwordElement.type="password";
                       this.passwordElement.value = '';
                       this.passwordElement.placeholder = 'Enter Password';
                    inputContainer.appendChild(this.passwordElement);


                    var copyButtonElement = document.createElement('button');
                    var messageElement = document.createElement('div');

                    copyButtonElement.id="copypassword";
                    messageElement.id="passwordmessage";

                    copyButtonElement.innerHTML="Copy to Clipboard";
                    messageElement.innerHTML="";
                    var that=this;
                    copyButtonElement.onclick=function(){
                           that.passwordElement.select();
                           document.execCommand("Copy");
                           messageElement.innerHTML="Password value is copied to clipboard";
                    };
                 inputContainer.appendChild(copyButtonElement);
                 inputContainer.appendChild(messageElement);

              formContainer.appendChild(inputContainer);
              return formContainer;
        },

        onSenderConnected:function(){
            this.contentContainer.innerHTML="";
            var inputForm=this.createInputForm();
            this.contentContainer.appendChild(inputForm);
            document.body.style.height="100px";
        },
        onSenderDisconnected:function(){

        },
        onInputUsername:function(username){
          if(this.usernameElement){
              this.usernameElement.value=username;
          }

        },
        onInputPassword:function(password){
          if(this.passwordElement){
              this.passwordElement.value=password;
          }
        }

};
document.addEventListener('DOMContentLoaded',  globalInput.onDocumentLoaded.bind(globalInput));
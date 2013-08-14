import processing.net.*;

class Page {
    
    PApplet app;
    int currentPage;
    
    Page(PApplet _app){
        
        app= _app;
        currentPage= 0;
    }
    
    int get(){
        return currentPage;
    }
    
    void refresh(int numOfTags0, int numOfTags1){
        
        int page= 2;
        Client client;
        
        if(numOfTags0==0){
            page= 0;
        } else if(numOfTags0==1){
            page= 1;
        }
    
        if(numOfTags1==0){
            page= 4;
        } else if(numOfTags1==1){
            page= 3;
        }
        
        if(currentPage!=page){
            currentPage= page;
        
//            client= new Client(app, "localhost", 8080);
//            client.write("GET /?page="+currentPage+" HTTP1.1\r\n");
//            client.write("Host: localhost\r\n\r\n");
        }
    }
}

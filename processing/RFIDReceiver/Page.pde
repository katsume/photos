import processing.net.*;

class Page {
    
    PApplet app;
    int numOfPages;
    int currentPage;
    
    Page(PApplet _app, int _numOfPages){
        
        app= _app;
        numOfPages= _numOfPages;
        currentPage= -1;
    }
    
    int get(){
        return currentPage;
    }
    
    void refresh(int numOfTags0, int numOfTags1){
        
        int page= -1;
//        Client client;

        if(numOfTags0+numOfTags1==numOfPages){
            page= numOfTags0;
        }
        
        if(currentPage!=page){
            currentPage= page;
        
//            client= new Client(app, "localhost", 8080);
//            client.write("GET /?page="+currentPage+" HTTP1.1\r\n");
//            client.write("Host: localhost\r\n\r\n");
        }
    }
}


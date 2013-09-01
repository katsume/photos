import processing.net.*;

class Page {
    
    int numOfPages;
    int currentPage;
    
    Page(int _numOfPages){
        
        numOfPages= _numOfPages;
        currentPage= -1;
    }
    
    int get(){
        return currentPage;
    }
    
    void refresh(int numOfTags0, int numOfTags1){
        
        int page= -1;

        if(numOfTags0+numOfTags1==numOfPages){
            page= numOfTags0;
        }
        
        if(currentPage!=page){
            currentPage= page;
            
            loadStrings("http://localhost:8080/?page="+currentPage);
        }
    }
}


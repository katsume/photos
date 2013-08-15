import java.util.List;

class Reader {
    
    int REFRESH_PERIOD= 200;
    
    ArrayList<String> tags;
    int currentIndex;
    int lastMillis;
    
    Reader(String[] _tags){
        
        tags= new ArrayList<String>(Arrays.asList(_tags));
        currentIndex= 0;
    }
    
    List<String> getCurrentTags(){
        return (List<String>)tags.subList(0, currentIndex);
    }
    
    void refresh(){
        
        if(millis()-lastMillis>REFRESH_PERIOD){
            if(currentIndex>0){
                currentIndex--;
            }
        }
    }
    
    void push(String id){
        
        int index= tags.indexOf(id);
        
        if(currentIndex>0 && index==currentIndex-1){
            lastMillis= millis();
        } else if(index==currentIndex){
            currentIndex++;
            lastMillis= millis();
        }
        
        currentIndex= min(currentIndex, 3);
        
    }
}


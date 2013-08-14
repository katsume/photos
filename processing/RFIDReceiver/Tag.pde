class Tag {
    
    int PERIOD= 200;
    
    String id;
    int time;

    Tag(String _id){

        id= _id;
        time= millis();
    }
    
    String id(){
        return id;
    }
    
    void extend(){
        time= millis();
    }
    
    boolean expired(){
        return millis()-time>PERIOD;
    }
}

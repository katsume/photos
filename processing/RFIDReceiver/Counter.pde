class Counter {
    
    int cnt;
    int duration;
    
    Counter(int _duration){
        
        cnt= 0;
        duration= _duration;
    }
    
    boolean update(){
        
        if(duration<=0){
            return false;
        }

        cnt++;
        
        if(cnt>=duration){
            cnt= 0;
            return true;
        }
        
        return false;
    }
}

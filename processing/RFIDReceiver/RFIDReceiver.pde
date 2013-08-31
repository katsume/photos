import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import processing.serial.*;

String[] SERIAL_PORTS= {
    "/dev/tty.usbmodem1421",
    "/dev/tty.usbmodem1411"
};

String[] TAG_IDS= {
    "2B1AB1B1",
    "3B9AAAB1",
    "5BF3ABB1",
    "6B0FA9B1"
};

int FRAME_RATE= 60;
int REFRESH_COUNT= 10;
int FONT_SIZE= 20;

ArrayList<Serial> serials= new ArrayList<Serial>();
ArrayList<Reader> readers= new ArrayList<Reader>();
Counter refreshCounter= new Counter(REFRESH_COUNT);
Page page= new Page(TAG_IDS.length);

void setup(){
    
    frameRate(FRAME_RATE);
    size(320, 240);
    
    for(int i=0; i<SERIAL_PORTS.length; i++){
        String port= SERIAL_PORTS[i];
        Serial serial= new Serial(this, port, 115200);
        serial.bufferUntil('\n');
        serials.add(serial);
    }
    
    readers.add(new Reader(TAG_IDS));
    readers.add(new Reader(reverse(TAG_IDS)));

    textSize(FONT_SIZE);
}

void draw(){

    background(0);
    
    if(refreshCounter.update()){
        
        Iterator it= readers.iterator();
        Reader reader;

        while(it.hasNext()){
            
            reader= (Reader)it.next();
            reader.refresh();
        }

        page.refresh(readers.get(0).getCurrentTags().size(), readers.get(1).getCurrentTags().size());
    }
    
    //    Debug view
    
    text(page.get(), 0, FONT_SIZE);

    for(int i=0; i<readers.size(); i++){
        
        List<String> currentTags= readers.get(i).getCurrentTags();
        int size= currentTags.size();  
        int x= i*(width/2);
        
        text(size, x, FONT_SIZE*5);
        
        for(int j=0; j<size; j++){
            int index= (i==0) ? j : size-1-j;
            text(currentTags.get(index), x, FONT_SIZE*(6+j));
        }
    }    
}

void serialEvent(Serial serial){

    String id= serial.readStringUntil('\n');
    id= trim(id);

    int index= serials.indexOf(serial);
    readers.get(index).push(id);

    serial.write(' ');
}


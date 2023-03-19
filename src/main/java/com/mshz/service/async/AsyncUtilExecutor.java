package com.mshz.service.async;

import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class AsyncUtilExecutor {

    private final AsycnUtils asycnUtils;

    public AsyncUtilExecutor(AsycnUtils asycnUtils){
        this.asycnUtils = asycnUtils;
    }

    @Async
    @Scheduled(cron = "0 59 23 ? * 7") // 23h:59 tous les dimanches de la semaine 
    public void executeSheduledTasks(){
        this.asycnUtils.deleteSeenNotifications();
    }
}

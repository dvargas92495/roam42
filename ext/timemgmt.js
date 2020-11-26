/* globals roam42 */

(() => {
  roam42.timemgmt = {};
  roam42.timemgmt.smartBlocks = {};
  roam42.timemgmt.smartBlocks.commands = {};
  
  roam42.timemgmt.getAllTasks = async ()=>{
    //returns array with format [{"uid":"","string":""},{"title":"","uid":""}] first is task, second is parent of task
    var todoUIDs = [];
    for(var task of await roam42.common.getBlocksReferringToThisPage('TODO')) 
        todoUIDs.push(task[0].uid)
    return await roam42.common.getPageNamesFromBlockUidList(todoUIDs);
  }
  
  // DUE TODAY FUNCTIONS
  roam42.timemgmt.todosDueToday = async (limitOutputCount = 50)=>{
    var todayDate = roam42.dateProcessing.parseTextForDates('today');
    var outputTODOs = [];
    var outputCounter = 1;
    for(var task of await roam42.timemgmt.getAllTasks()) {
      if(outputCounter < limitOutputCount && task[0].string.includes('{{[[TODO]]}}') && task[0].string.includes(todayDate)) {
        outputCounter += 1;
        outputTODOs.push({taskUID: task[0].uid, pageTitle: task[1].title})
      }
    }    
    return outputTODOs;
  }
  
  // DUE TODAY Used in menu to directly insert TODOS
  roam42.timemgmt.smartBlocks.todosDueToday = async ()=> {
    for(var task of await roam42.timemgmt.todosDueToday()) 
      await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);   
    await roam42.smartBlocks.outputArrayWrite()
  }

  // DUE TODAY COMMAND to use in workflow
  roam42.timemgmt.smartBlocks.commands.todosDueToday = async (limitOutputCount = 50)=> {
    var firstBlock = '';
    for(var task of await roam42.timemgmt.todosDueToday(limitOutputCount)) {
      if(firstBlock=='') 
        firstBlock = `((${task.taskUID}))`;
      else
        await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);  
    }
    return firstBlock;
  }

  // OVERDUE Used in menu to directly insert TODOS
  roam42.timemgmt.smartBlocks.todosOverdue = async ()=> {
    for(var task of await roam42.timemgmt.todosOverdue(100,true,false)) 
      await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);   
    if(roam42.smartBlocks.activeWorkflow.arrayToWrite.length>10) {
      if(confirm("Would you like to insert " + roam42.smartBlocks.activeWorkflow.arrayToWrite.length + " blocks refs with Overdue TODOS?"))
        await roam42.smartBlocks.outputArrayWrite()
    } else 
        await roam42.smartBlocks.outputArrayWrite()
  }

  // OVERDUE COMMAND to use in workflow
  roam42.timemgmt.smartBlocks.commands.todosOverdue = async (limitOutputCount = 50, includeDNP=false)=> {
    var firstBlock = '';
    for(var task of await roam42.timemgmt.todosOverdue(limitOutputCount,true,includeDNP)) {
      if(firstBlock=='') 
        firstBlock = `((${task.taskUID}))`;
      else
        await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);  
    }  
    return firstBlock
  }
  

  roam42.timemgmt.smartBlocks.todosOverduePlusDNP = async ()=> {
    for(var task of await roam42.timemgmt.todosOverdue(100,true,true)) 
      await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);   
    if(roam42.smartBlocks.activeWorkflow.arrayToWrite.length>10) {
      if(confirm("Would you like to insert " + roam42.smartBlocks.activeWorkflow.arrayToWrite.length + " blocks refs with Overdue+DNP TODOS?"))
        await roam42.smartBlocks.outputArrayWrite()
    } else 
        await roam42.smartBlocks.outputArrayWrite()
  }

  // FUTURE Used in menu to directly insert TODOS  
  roam42.timemgmt.smartBlocks.todosFuture = async ()=> {
    for(var task of await roam42.timemgmt.todosFuture(100,true,false)) 
      await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);   
    if(roam42.smartBlocks.activeWorkflow.arrayToWrite.length>10) {
      if(confirm("Would you like to insert " + roam42.smartBlocks.activeWorkflow.arrayToWrite.length + " blocks refs with Overdue TODOS?"))
        await roam42.smartBlocks.outputArrayWrite()
    } else 
        await roam42.smartBlocks.outputArrayWrite()
  }
  
  roam42.timemgmt.smartBlocks.todosFuturePlusDNP = async ()=> {
    for(var task of await roam42.timemgmt.todosFuture(100,true,true)) 
      await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);   
    if(roam42.smartBlocks.activeWorkflow.arrayToWrite.length>10) {
      if(confirm("Would you like to insert " + roam42.smartBlocks.activeWorkflow.arrayToWrite.length + " blocks refs with Overdue+DNP TODOS?"))
        await roam42.smartBlocks.outputArrayWrite()
    } else 
        await roam42.smartBlocks.outputArrayWrite()
  }  
  
  // FUTURE COMMAND to use in workflow
  roam42.timemgmt.smartBlocks.commands.todosFuture = async (limitOutputCount = 50, includeDNP=false)=> {
    var firstBlock = '';
    for(var task of await roam42.timemgmt.todosFuture(limitOutputCount,true,includeDNP)) {
      if(firstBlock=='') 
        firstBlock = `((${task.taskUID}))`;
      else
        await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);  
    }  
    return firstBlock
  }  

  // UNDATED
  roam42.timemgmt.smartBlocks.todoNotDated = async ()=> {
    for(var task of await roam42.timemgmt.todoNotDated(100)) 
      await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);  
    if(roam42.smartBlocks.activeWorkflow.arrayToWrite.length>10) {
      if(confirm("Would you like to insert " + roam42.smartBlocks.activeWorkflow.arrayToWrite.length + " blocks refs with undated TODOS?"))
        await roam42.smartBlocks.outputArrayWrite()
    } else 
        await roam42.smartBlocks.outputArrayWrite()
  }
  
  // UNDATED COMMAND to use in workflow
  roam42.timemgmt.smartBlocks.commands.todoNotDated = async (limitOutputCount = 50)=> {
    var firstBlock = '';
    for(var task of await roam42.timemgmt.todoNotDated(limitOutputCount)) {
      if(firstBlock=='') 
        firstBlock = `((${task.taskUID}))`;
      else
        await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);  
    }  
    return firstBlock
  }    
  
  
  roam42.timemgmt.todosOverdue = async (limitOutputCount = 50, sortAscending=true, includeDNPTasks=true)=>{
    var yesterday = new Date().setDate( new Date().getDate() - 1 );
    var outputTODOs = [];
    var outputCounter = 1;
    //STEPS: (1) loop through each tag to see if it is a date before today (2) Also check if page name is dated
    for(var task of await roam42.timemgmt.getAllTasks()) {
      if(outputCounter < limitOutputCount) {
        var taskWasOutputted=false; //tracks for this loop if thee was an output
        var testForPages=null;
        if(task[0].string.includes('{{[[TODO]]}}')) //confirm there is a TODO in the string properly formatted
          testForPages = task[0].string.replace('[[TODO]]','').match(/\[\[(\s*[\S\s]*?)\]\]/g)
        if(testForPages!=null) {
          for(let page of testForPages) {
            var testForDate = roam42.dateProcessing.testIfRoamDateAndConvert(page);
            if(testForDate && testForDate <= yesterday) {
              outputCounter+=1;
              taskWasOutputted=true;
              outputTODOs.push({taskUID: task[0].uid, pageTitle: task[1].title, date:testForDate})
            } 
          }
        } //end of testForPages!=null
        //This task has no date, but check if it is on a DNP, thus inherits the date
        if(includeDNPTasks && taskWasOutputted==false) {          
          var pageNameIsDate = roam42.dateProcessing.testIfRoamDateAndConvert(task[1].title);
          if(pageNameIsDate && pageNameIsDate <= yesterday) {
                outputCounter+=1;
                outputTODOs.push({taskUID: task[0].uid, pageTitle: task[1].title, date:pageNameIsDate })
          }
        } //end of includeDNPTasks
      } // end outputCounter < limitOutputCount
    } //end of for
    return outputTODOs.sort((a, b) =>  a.pageTitle-b.pageTitle ).
                       sort((a, b) => sortAscending ? a.date-b.date : b.date-a.date );
  }
  
  roam42.timemgmt.todosFuture = async (limitOutputCount = 50, sortAscending=true, includeDNPTasks=true)=>{
    var tomorrow = new Date().setDate( new Date().getDate() + 1 );
    var outputTODOs = [];
    var outputCounter = 1;
    //STEPS: (1) loop through each tag to see if it is a date before today (2) Also check if page name is dated
    for(var task of await roam42.timemgmt.getAllTasks()) {
      if(outputCounter < limitOutputCount) {
        var taskWasOutputted=false; //tracks for this loop if thee was an output
        var testForPages=null;
        if(task[0].string.includes('{{[[TODO]]}}')) //confirm there is a TODO in the string properly formatted
          testForPages = task[0].string.replace('[[TODO]]','').match(/\[\[(\s*[\S\s]*?)\]\]/g)
        if(testForPages!=null) {
          for(let page of testForPages) {
            var testForDate = roam42.dateProcessing.testIfRoamDateAndConvert(page);
            if(testForDate && testForDate >= tomorrow) {
              outputCounter+=1;
              taskWasOutputted=true;
              outputTODOs.push({taskUID: task[0].uid, pageTitle: task[1].title, date:testForDate})
            } 
          }
        } //end of testForPages!=null
        //This task has no date, but check if it is on a DNP, thus inherits the date
        if(includeDNPTasks && taskWasOutputted==false) {          
          var pageNameIsDate = roam42.dateProcessing.testIfRoamDateAndConvert(task[1].title);
          if(pageNameIsDate && pageNameIsDate >= tomorrow) {
                outputCounter+=1;
                outputTODOs.push({taskUID: task[0].uid, pageTitle: task[1].title, date:pageNameIsDate })
          }
        } //end of includeDNPTasks
      } // end outputCounter < limitOutputCount
    } //end of for
    return outputTODOs.sort((a, b) =>  a.pageTitle-b.pageTitle ).
                       sort((a, b) => sortAscending ? a.date-b.date : b.date-a.date );
  }  
  
  roam42.timemgmt.todoNotDated = async (limitOutputCount = 100)=>{
    var outputTODOs = [];
    var outputCounter = 1;
    for(var task of await roam42.timemgmt.getAllTasks()) {
      var testForPages = task[0].string.replace('[[TODO]]','').match(/\[\[(\s*[\S\s]*?)\]\]/g)
      var todoContainsDate = false;
      if(testForPages) {
        for(let page of testForPages) {
          var testForDate = roam42.dateProcessing.testIfRoamDateAndConvert(page);
          if(!testForDate ) 
            todoContainsDate = true
        }
      } // end of first IF
      if(outputCounter < limitOutputCount && todoContainsDate==false){
        outputCounter+=1;
        outputTODOs.push({taskUID: task[0].uid, pageTitle: task[1].title})
      }
      todoContainsDate = false;
    } //end of for
    return outputTODOs.sort((a, b) => a.pageTitle-b.pageTitle );
  }  
  
  window.roam42.timemgmt.testingReload = () => {
    roam42.loader.addScriptToPage( "timemgmt", roam42.host + 'ext/timemgmt.js');
    setTimeout(async ()=>{
      // console.clear()
      // console.log(await roam42.timemgmt.todoNotDated(25))
    },2000)
  };
})();
(function () {
  angular.module("app").controller("RepositoryController", repositoryController);
  repositoryController.$inject = ["$http", "apiRepositories", "apiContributors", "apiCommits"];

  function repositoryController($http, apiRepositories, apiContributors, apiCommits) {
    var vm = this;
    vm.repository = [];

    // ------------- Início Variáveis Canvas ------------- //
    vm.colors = ['#082659', '#00b9b5', '#707070'];
    vm.labels = [];
    vm.data = [];
    vm.datasetOverride = [
        {
            label: "Commits",
            borderWidth: 3,
            type: 'line'
        }
    ];
    // ------------- Fim Variáveis Canvas ------------- //
    
    function updateCommit() {
      apiCommits.getCommits(vm.repoSelect.name).then(function (response) { 
        // Reset Array                         
        vm.labels = [];
        vm.data = [];  

        var countCommits = 0;                           
        var monthNames = ["January", "February", "March", 
                          "April", "May", "June", "July",
                          "August", "September", "October",
                          "November", "December"];
        
        for (var i = 0; i < response.data.length; i++) { 
          var date = new Date(response.data[i].commit.committer.date);

          if (!vm.labels.includes(monthNames[date.getMonth()])) {                            
            vm.labels.push(monthNames[date.getMonth()]);

            if (countCommits != 0) {
              vm.data.push(countCommits);                                                       
            }        

            countCommits = 1; 
          } else {
            countCommits += 1;                                                      
          }          
        }

        vm.data.push(countCommits);
        vm.data.push(0);   
      });
    }

    vm.updateData = function() {
      apiContributors
        .getContributors(vm.repoSelect.name)
        .then(function (response) {
          vm.contributorsNumber = response.data.length;                    
        }
      );  
      updateCommit();         
    }

    function getRepository() {
      apiRepositories
        .allRepositories()
        .then(function (response) {
          vm.repository = response.data;
          vm.repoSelect = vm.repository[0];
          vm.updateData();                    
      });
    }   
    
    getRepository();    
  }
})();
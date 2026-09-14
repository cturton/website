const polish=document.createElement('link');polish.rel='stylesheet';polish.href='refined.css';document.head.append(polish);
const $=s=>document.querySelector(s),money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const baseline={profit:367000,spend:-15,conversion:4,expansion:12,onboarding:25};
const customers=[['Aster Health','Enterprise',142000,'High'],['Nolan Retail','Mid-market',68000,'High'],['Pineworks','Enterprise',121000,'Medium'],['Kindred Labs','Growth',39000,'Medium'],['Vista Home','Mid-market',74000,'High']];
function render(){
 $('#kpis').innerHTML=[['Revenue', '$1.84M','+8.4% vs. plan'],['Gross margin','61.2%','-1.6 pts vs. plan'],['Operating profit','$367K','+3.1% vs. plan'],['Net revenue retention','112.4%','+5.8 pts YoY']].map(x=>'<article class="kpi"><p>'+x[0]+'</p><strong>'+x[1]+'</strong><em>'+x[2]+'</em></article>').join('');
 const months=[['Apr',55,39],['May',62,43],['Jun',59,41],['Jul',71,48],['Aug',77,49],['Sep',84,51]];
 $('#trendChart').innerHTML=months.map(x=>'<div class="month" data-label="'+x[0]+'"><i class="bar" style="height:'+x[1]+'%"></i><i class="bar profit" style="height:'+x[2]+'%"></i></div>').join('');
 const drivers=[['Plan operating profit',78,'base'],['Enterprise expansion',44,'positive'],['Pricing realization',26,'positive'],['West acquisition cost',37,'negative'],['Infrastructure cost',17,'negative'],['Actual operating profit',88,'base']];
 $('#waterfall').innerHTML=drivers.map(x=>'<div class="water-item '+x[2]+'"><span>'+(x[2]==='negative'?'-':'+')+money(x[1]*1000)+'</span><div class="wfbar" style="height:'+x[1]+'%"></div><small>'+x[0]+'</small></div>').join('');
 $('#actions').innerHTML=[['1','Shift 15% of West paid-media spend to high-intent channels','+$42K profit','Scenario lab'],['2','Launch enterprise expansion program for 12 qualified accounts','+$96K gross profit','Customer health'],['3','Require activation milestone by week 4 for new accounts','+5.8 pts retention','Customer health']].map(x=>'<article class="action"><span class="rank">'+x[0]+'</span><div><h3>'+x[1]+'</h3><p class="muted">Evidence-backed opportunity; owner and due date ready to assign.</p></div><span class="impact">'+x[2]+'</span><button class="text-button" data-go="'+(x[3]==='Scenario lab'?'scenario':'customers')+'">Explore</button></article>').join('');
 $('#segments').innerHTML=[['Champions',39,'34% of revenue','High value, high engagement'],['Expansion-ready',67,'28% of revenue','Usage rising; commercial opening'],['At risk',24,'12% of revenue','Intervention recommended'],['Long tail',418,'26% of revenue','Automate success motions']].map(x=>'<article class="segment"><strong>'+x[1]+'</strong><p>'+x[0]+'</p><small>'+x[2]+' | '+x[3]+'</small></article>').join('');
 $('#customerTable').innerHTML=customers.map(x=>'<div class="account"><span><b>'+x[0]+'</b><br><small class="muted">'+x[1]+'</small></span><span>'+money(x[2])+'</span><span class="risk">'+x[3]+' risk</span></div>').join('');
 bindGo();
}
function bindGo(){document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go))}
function updateScenario(){
 const spend=+$('#spend').value,conversion=+$('#conversion').value,expansion=+$('#expansion').value,onboarding=+$('#onboarding').value;
 $('#spendOut').value=spend+'%';$('#conversionOut').value='+'+conversion+'%';$('#expansionOut').value=expansion;$('#onboardingOut').value='$'+onboarding+'K';
 const profit=baseline.profit+(Math.abs(spend)*2100)+(conversion*6300)+(expansion*4600)-(onboarding*1000),delta=profit-baseline.profit,roi=(delta/Math.max(onboarding,1)).toFixed(1);
 $('#scenarioProfit').textContent=money(profit);$('#profitChange').textContent=(delta>=0?'+':'')+money(delta);$('#roi').textContent=roi+'x';$('#confidence').textContent=Math.min(92,68+conversion+Math.round(expansion/4))+'%';
 $('#recommendation').textContent='Reduce West spend by '+Math.abs(spend)+'%, prioritize a '+conversion+'% conversion lift, and run '+expansion+' enterprise expansion plays. The projected upside outweighs the '+money(onboarding*1000)+' onboarding investment.';
}
function show(view){document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.id===view));document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x.dataset.view===view));$('#pageTitle').textContent=({overview:'Business performance, explained.',drivers:'Where profit moved - and why.',customers:'Customer health, made actionable.',scenario:'Test the decision before you make it.'})[view];scrollTo(0,0)}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>show(b.dataset.view));
['spend','conversion','expansion','onboarding'].forEach(id=>$('#'+id).oninput=updateScenario);
$('#applyScenario').onclick=()=>{localStorage.setItem('northstar-scenario',JSON.stringify({spend:$('#spend').value,conversion:$('#conversion').value,expansion:$('#expansion').value,onboarding:$('#onboarding').value}));alert('Scenario saved locally for this browser.')};
$('#reset').onclick=()=>{localStorage.removeItem('northstar-scenario');location.reload()};
$('#export').onclick=()=>{const text='NORTHSTAR BI EXECUTIVE BRIEF\n\nRevenue: $1.84M (+8.4% vs plan)\nOperating profit: $367K (+3.1% vs plan)\n\nPriority action: Shift 15% of West paid-media spend to high-intent channels; modeled profit impact +$42K.\n\nCustomer observation: Week-4 activation predicts retention at 2.3x.';const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/plain'}));a.download='northstar-executive-brief.txt';a.click();URL.revokeObjectURL(a.href)};
const saved=JSON.parse(localStorage.getItem('northstar-scenario')||'null');if(saved)Object.keys(saved).forEach(k=>$('#'+k).value=saved[k]);render();updateScenario();

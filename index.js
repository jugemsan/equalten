/**
 * equal ten!
 * for Alexa Skills Kit v2
 * 
 * by IMAI Takashi(@jugemsan)
 * 
 * Sound by KOUICHI(Maou-Damashii)
 * https://maoudamashii.jokersounds.com/
 **/
/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

// Messages
const SKILL_NAME = 'イコール<prosody pitch="+12%">テ</prosody><prosody pitch="+5%">ン</prosody>';
const V_REPROMPT = '始めるときはスタート、と言ってね。';
const V_MSG_LAUNCH1 = SKILL_NAME + 'へようこそ。これから読み上げる数式に、足したら１０になる数字を答えてね。';
const V_MSG_LAUNCH2 = V_REPROMPT;
const V_MSG_LAUNCH_R = SKILL_NAME + V_REPROMPT;

const V_LEVELUP = 'レベルアップす<prosody pitch="+8%">る</prosody><prosody pitch="+5%">よ</prosody>？';
const V_MSG_LEVELUP1 = 'オッケー！ここから' + V_LEVELUP;
const V_MSG_LEVELUP2 = '<prosody pitch=\"+10%\">いー</prosody>ねえ！さらに' + V_LEVELUP;
const V_MSG_LEVELUP3 = 'なかなかやるね！これからはどんどん' + V_LEVELUP;

const V_MSG_GAMEOVER1 = 'ゲームオーバー！スコアは';
const V_MSG_GAMEOVER2 = '点でした！';
const V_MSG_HISCORE = 'ハイスコ<prosody pitch="-10%">ア</prosody>更新！おめでとう！';
const V_MSG_TOREPLAY = 'リプレイはスタートと言ってね。';
const V_MSG_GIVEUP ='ギブアップする？はい、か、いいえで教えてね。';
const V_MSG_GIVEUP_R = 'はい、か、いいえで教えてね。';
const V_MSG_RESTART = '再開します、';

const V_HELP = 'このゲームでは、アレクサが読み上げる数式に、足したら１０になる数字を答えてね。３、マイナス２、のように数字を答えるか、足す３、引く２、のように数式の続きを答えてね。<break time="300ms"/>';
const V_MSG_HELP = SKILL_NAME + '、' + V_HELP + V_REPROMPT;
const V_MSG_HELP_R = SKILL_NAME + V_REPROMPT;
const V_MSG_HELP2 = V_HELP;
const V_MSG_HELP2_R = '';
const V_MSG_HELP3 = 'ギブアップする？はい、かいいえ、で教えてね。';
const V_MSG_HELP3_R = V_MSG_HELP3;
const V_MSG_STOP = 'あそんでく<prosody pitch="+12%">れて</prosody>ありがとう、また来てね！';
const V_MSG_ERROR = 'すみません、エラーが発生したので終了します。';

// Voices
const F_ROOT = 'https://<your resource path>/';
const F_START = F_ROOT + 'start.mp3';
const F_PINPON = F_ROOT + 'pinpon.mp3';
const F_BOO = F_ROOT + 'boo.mp3';
const F_HISCORE = F_ROOT + 'hiscore.mp3';

// const
const LEVELSTEP = 3;

// Functions
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Handlers
const LaunchHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    return request.type === 'LaunchRequest'
        || (request.type === 'IntentRequest'
           && ((request.intent.name === 'AnswerIntent'      && ((!(attributes.state))||(attributes.state == '_MENU' )) )
            || (request.intent.name === 'GiveUpIntent'      && ((!(attributes.state))||(attributes.state == '_MENU' )) )
            || (request.intent.name === 'AMAZON.YesIntent'  && ((!(attributes.state))||(attributes.state == '_MENU' )) )
            || (request.intent.name === 'AMAZON.NoIntent'   && ((!(attributes.state))||(attributes.state == '_MENU' )) )));
  },
  async handle(handlerInput) {
    console.log('<<<LaunchHandler>>>');

    // state
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    attributes.state = "_MENU";    

/*
    // hiscore
    var hiscore = 0;

    console.log('1!');
    let persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes(); //永続アトリビュートオブジェクトを取り出す。非同期処理なのでawaitを付加する

    if ( !persistentAttributes.hiscore ) { // 初期化
        console.log('2!');
        persistentAttributes.hiscore = 0;
        // 永続アトリビュートの保存
//        handlerInput.attributesManager.setPersistentAttributes(persistentAttributes);
        await handlerInput.attributesManager.savePersistentAttributes(); // 非同期処理なのでawaitを付加する
    } else {
        console.log('3!');
        hiscore = persistentAttributes.hiscore; // ハイスコアを取得
    }
*/
    // speech    
//    const speechOutput = V_MSG_LAUNCH1 + hiscore + V_MSG_LAUNCH2;
    const speechOutput = V_MSG_LAUNCH1 + V_MSG_LAUNCH2;
    const reprompt = V_MSG_LAUNCH_R;
    attributes.prev_reprompt = '';

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt)
      .getResponse();
  },
};

const NewGameHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    return request.type === 'IntentRequest'
        && ( (request.intent.name === 'NewGameIntent') && ((!(attributes.state))||(attributes.state == '_MENU')) );
  },
  handle(handlerInput) {
    console.log('<<<NewGameHandler>>>');

    // initialize the game
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    attributes.level = 1;
    attributes.score = 0;

    // making question 
    do {
      var a1 = getRandomInt(6);
      var a2 = getRandomInt(6);
      attributes.answer = 10 - (a1 + a2);
      console.log('a1=' + a1 + '/a2=' + a2);
    } while ( attributes.answer == 0);

    // state
    attributes.state = "_GAME";    

    // speech    
    const s1 = "<audio src='" + F_START + "' />" + '第一問。';
    const s2 = SKILL_NAME + 'は、<prosody rate="80%">' + a1 + 'たす' + a2 + 'たすなに？</prosody>';
    const speechOutput = s1 + s2;
    const reprompt = s2;
    attributes.prev_reprompt = reprompt;
    attributes.wait_question = reprompt;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt)
      .getResponse();
  },
};


const AnswerHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    return request.type === 'IntentRequest'
        && ( (request.intent.name === 'AnswerIntent') && (attributes.state == '_GAME') );
  },
  async handle(handlerInput) {
    console.log('<<<AnswerHandler>>>');
    const request = handlerInput.requestEnvelope.request;
    var speechOutput;
    var reprompt;

    // こたえあわせ
    let attributes = handlerInput.attributesManager.getSessionAttributes();

    // numberが空の場合＝リトライ
    if (( !request.intent.slots.number ) || ( !request.intent.slots.number.value )){
      // retry
      console.log('retry!!!');
      speechOutput = 'もう一度答えてね！' + attributes.prev_reprompt;
      reprompt = attributes.prev_reprompt;
      attributes.state = '_GAME';
    } else {

    // numberが空でない場合
      console.log('no retry!!!');
      // 正しい答
      var ans = attributes.answer;

      // ユーザの回答
      var fla = 1;
      if ( request.intent.slots.flag.value ) {
        if (request.intent.slots.flag.value=='マイナス') { fla = -1; }
        console.log('マイナス');
      }
      var ans2 = (request.intent.slots.number.value) * fla;

      console.log('ans=' + ans + ':fla=' + fla + ':ans2=' + ans2);

      // 正解の場合
      if (ans == ans2) {
        attributes.score++;
        var sp1 = "";
        var sp2 = "";
        attributes.level++;

        var lev = attributes.level;
        var a1,a2;

        speechOutput = "<audio src='" + F_PINPON + "' />";

        // making question 
        if ( lev <= LEVELSTEP) {
          sp1 += '次の問題。';
          sp2 = SKILL_NAME + 'は、<prosody rate="80%">';
          do {
            a1 = getRandomInt(6);
            a2 = getRandomInt(6);
            attributes.answer = 10 - (a1 + a2);
          } while ( attributes.answer == 0);
          sp2 += a1;
          sp2 += 'たす' + a2;
        } else if (lev <= LEVELSTEP*2) {
          if ((lev % LEVELSTEP)==1) { speechOutput += V_MSG_LEVELUP1; }
          sp1 += '次の問題。';
          sp2 = SKILL_NAME + 'は、<prosody rate="80%">';
          do {
            a1 = getRandomInt(11)-5;
            a2 = getRandomInt(11)-5;
            attributes.answer = 10 - (a1 + a2);
          } while ( attributes.answer == 0);
          sp2 += a1;
          if( a2>=0) { sp2 += 'たす' + a2; } else { sp2 += 'ひく' + (-1)*a2; }
        } else if (lev <= LEVELSTEP*3) {
          if ((lev % LEVELSTEP)==1) { speechOutput += V_MSG_LEVELUP2; }
          sp1 += '次の問題。';
          sp2 = SKILL_NAME + 'は、<prosody rate="80%">';
          do {
            a1 = getRandomInt(11)-5;
            a2 = getRandomInt(21)-10;
            attributes.answer = 10 - (a1 + a2);
          } while ( attributes.answer == 0);
          sp2 += a1;
          if( a2>=0) { sp2 += 'たす' + a2; } else { sp2 += 'ひく' + (-1)*a2; }
        } else {
          if (lev == (LEVELSTEP*3+1)) { speechOutput += V_MSG_LEVELUP3; }
          sp1 += '次の問題。';
          sp2 = SKILL_NAME + 'は、<prosody rate="80%">';
          do {
            a1 = getRandomInt(21)-10;
            if( a1>=0) { sp2 += a1; } else { sp2 += 'マイナス' + (-1)*a1; }
            attributes.answer = 10 - a1;
            for(var i=0; i<=Math.floor((lev-LEVELSTEP*3-1)/LEVELSTEP); i++) {
              a2 = getRandomInt(21)-10;
              if( a2>=0) { sp2 += 'たす' + a2; } else { sp2 += 'ひく' + (-1)*a2; }
              attributes.answer -= a2;
            }
          } while ( attributes.answer == 0);
        }
        sp2 += 'たすなに？</prosody>';
        speechOutput += sp1 + sp2;
        reprompt = sp2;
        attributes.prev_reprompt = reprompt;
        attributes.wait_question = reprompt;
        attributes.state = '_GAME';
      } else {
      // 不正解の場合
        // GAMEOVER
        attributes.state = '_MENU';

        // speech
        await loadHiScore(handlerInput);
        var score = attributes.score;
        var hiscore = attributes.hiscore;
        console.log('score=' + score + ':hi=' + hiscore);

        speechOutput = "<audio src='" + F_BOO + "' />";
        speechOutput += V_MSG_GAMEOVER1 + score + V_MSG_GAMEOVER2;
        if (score > hiscore) {
          await saveHiScore(handlerInput, score);
          speechOutput += "<audio src='" + F_HISCORE + "' />" + V_MSG_HISCORE;
        }

        speechOutput += V_MSG_TOREPLAY;
        reprompt = V_MSG_TOREPLAY;
        attributes.prev_reprompt = reprompt;
      }
    }

    // speech    
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt)
      .getResponse();
  },
};

const GiveUpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    return request.type === 'IntentRequest'
      && ( ((request.intent.name === 'NewGameIntent') && (attributes.state == '_GAME'))
        || ((request.intent.name === 'GiveUpIntent' ) && (attributes.state == '_GAME'))
        || ((request.intent.name === 'AMAZON.StopIntent') && (attributes.state == '_GAME')) );
  },
  handle(handlerInput) {
    console.log('<<<GiveUpHandler>>>');
    const request = handlerInput.requestEnvelope.request;
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    var speechOutput;
    var reprompt;

    // GIVE UP?
    attributes.state = '_WAIT';

    // speech    
    speechOutput = V_MSG_GIVEUP;
    reprompt = V_MSG_GIVEUP_R;
    attributes.prev_reprompt = reprompt;

    // speech    
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt)
      .getResponse();  },
};


const RestartHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    return request.type === 'IntentRequest'
      && ( (request.intent.name === 'AMAZON.NoIntent') && (attributes.state == '_WAIT') );
  },
  handle(handlerInput) {
    console.log('<<<RestartHandler>>>');
    const request = handlerInput.requestEnvelope.request;
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    var speechOutput;
    var reprompt;

    // GIVE UP?
    attributes.state = '_GAME';

    // speech    
    speechOutput = V_MSG_RESTART + attributes.wait_question;
    reprompt = attributes.wait_question;

    // speech    
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt)
      .getResponse();  },
};

const GameOverHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    return request.type === 'IntentRequest'
      && ( ((request.intent.name === 'NewGameIntent'    ) && (attributes.state == '_WAIT'))
        || ((request.intent.name === 'GiveUpIntent'     ) && (attributes.state == '_WAIT'))
        || ((request.intent.name === 'AMAZON.YesIntent' ) && (attributes.state == '_WAIT'))
        || ((request.intent.name === 'AMAZON.StopIntent') && (attributes.state == '_WAIT')));
  },
  async handle(handlerInput) {
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    console.log('<<<GameOverHandler>>>');
    var speechOutput;
    var reprompt;

    // GAMEOVER
    attributes.state = '_MENU';

    // speech
    await loadHiScore(handlerInput);
    var score = attributes.score;
    var hiscore = attributes.hiscore;
    console.log('score=' + score + ':hi=' + hiscore);

    speechOutput = "<audio src='" + F_BOO + "' />";
    speechOutput += V_MSG_GAMEOVER1 + score + V_MSG_GAMEOVER2;
    if (score > hiscore) {
      await saveHiScore(handlerInput, score);
      speechOutput += "<audio src='" + F_HISCORE + "' />" + V_MSG_HISCORE;
    }

    speechOutput += V_MSG_TOREPLAY;
    reprompt = V_MSG_TOREPLAY;
    attributes.prev_reprompt = reprompt;

    // speech
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt)
      .getResponse();  },
};

const ReconfirmHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    return request.type === 'IntentRequest'
      && ( ( request.intent.name === 'AMAZON.YesIntent' && attributes.state == '_GAME' )
        || ( request.intent.name === 'AMAZON.NoIntent'  && attributes.state == '_GAME' )) ;
  },
  handle(handlerInput) {
    console.log('<<<ReconfirmHandler>>>');
    const request = handlerInput.requestEnvelope.request;
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    var speechOutput;
    var reprompt;

    // speech    
    speechOutput = 'もう一度。' + attributes.prev_reprompt;
    reprompt = attributes.prev_reprompt;

    // speech    
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt)
      .getResponse();  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    return request.type === 'IntentRequest'
      && ((request.intent.name === 'AMAZON.CancelIntent')
      || (request.intent.name === 'AMAZON.StopIntent' && attributes.state == '_MENU' ))  },
  handle(handlerInput) {
    console.log('<<<ExitHandler>>>');
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    // attributes init
    attributes.state = "";
    attributes.prev_reprompt = "";

    return handlerInput.responseBuilder
      .speak(V_MSG_STOP)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    let attributes = handlerInput.attributesManager.getSessionAttributes();

    var speechOutput = '';
    var reprompt = '';
    var sta = attributes.state;

    if (sta == '_GAME') {
      speechOutput = V_MSG_HELP2;
      reprompt = V_MSG_HELP2_R;
      if ( attributes.prev_reprompt ) {
        speechOutput += attributes.prev_reprompt;
        reprompt += attributes.prev_reprompt;
      }
    } else if (sta == '_WAIT') {
      speechOutput = V_MSG_HELP3;
      reprompt = V_MSG_HELP3_R;
    } else {
      speechOutput = V_MSG_HELP;
      reprompt = V_MSG_HELP_R;
    }

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    const request = handlerInput.requestEnvelope.request;
    let attributes = handlerInput.attributesManager.getSessionAttributes();

    console.log('Request.type=' + request.type);
    console.log('Request.Intent=' + request.intent.name);
    console.log('a.state=' + attributes.state);

    return handlerInput.responseBuilder
      .speak(V_MSG_ERROR)
      .getResponse();
  },
};

/*
 *
 *
 */
async function loadHiScore(handlerInput) {
  var hiscore = 0;
  let attributes = handlerInput.attributesManager.getSessionAttributes();

  console.log('1!');
  let persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes(); //永続アトリビュートオブジェクトを取り出す。非同期処理なのでawaitを付加する

  if ( !persistentAttributes.hiscore ) { // 初期化
    console.log('2!');
    attributes.hiscore = 0;
    persistentAttributes.hiscore = 0;
    handlerInput.attributesManager.setPersistentAttributes(persistentAttributes);
    await handlerInput.attributesManager.savePersistentAttributes(); // 非同期処理なのでawaitを付加する
    } else {
    console.log('2-2!');
    attributes.hiscore = persistentAttributes.hiscore; // ハイスコアを取得
  }
}

async function saveHiScore(handlerInput, score) {
  console.log('3!');
  let persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes(); //永続アトリビュートオブジェクトを取り出す。非同期処理なのでawaitを付加する
  // 永続アトリビュートの保存
  console.log('4!');
  persistentAttributes.hiscore = score;
  handlerInput.attributesManager.setPersistentAttributes(persistentAttributes);
  console.log('5!');
  await handlerInput.attributesManager.savePersistentAttributes(); // 非同期処理なのでawaitを付加する
  console.log('6!');
}


const config = {
  tableName: 'equalTenTable', // DynamoDBのテーブル名
  createTable: true // テーブルを自動生成する場合true (ただし権限が必要)
};
//const DynamoDBAdapter = new Adapter.DynamoDbPersistenceAdapter(config);

const skillBuilder = Alexa.SkillBuilders.standard()

exports.handler = skillBuilder
  .addRequestHandlers(
    ReconfirmHandler,
    GameOverHandler,
    RestartHandler,
    GiveUpHandler,
    AnswerHandler,
    NewGameHandler,
    LaunchHandler,
    ExitHandler,
    HelpHandler,
    SessionEndedRequestHandler
  )
//  .withPersistenceAdapter(DynamoDBAdapter) // DynamoDBAdapterをPersistenceAdapterに設定する
  .withTableName('equalTenTable')
  .withAutoCreateTable(true)
  .addErrorHandlers(ErrorHandler)
  .lambda();
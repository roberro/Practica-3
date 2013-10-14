/*


En el anterior prototipo, el objeto Game permite gestionar una pila de
tableros (boards). Los tres campos de estrellas, la pantalla de inicio
y el sprite de la nave del jugador se añaden como tableros
independientes para que Game pueda ejecutar sus métodos step() y
draw() periódicamente desde su método loop(). Sin embargo los tableros
no pueden interaccionar entre sí. Resulta difícil con esta
arquitectura pensar en cómo podría por ejemplo detectarse la colisión
de una nave enemiga con la nave del jugador, o cómo podría detectarse
si un disparo de colisiona con una nave.

Este es precisamente el requisito que se ha identificado para este
prototipo: gestionar la interacción entre los elementos del
juego. Piensa en esta clase como un tablero de juegos de mesa, sobre
el que se disponen los elementos del juego (fichas, cartas, etc.). En
este caso serán naves enemigas, nave del jugador y disparos los
elementos del juego. Para Game, GameBoard será un tablero más, por lo
que deberá ofrecer los métodos step() y draw(), y será responsable de
mostrar todos los objetos que contenga cuando Game llame a estos
métodos.



Especificación: GameBoard debe

- mantener una colección de objetos a la que se pueden añadir y de la
  que se pueden eliminar sprites

- interacción con Game: cuando reciba los métodos step() y draw() debe
  ocuparse de que se ejecuten estos métodos en todos los objetos que
  contenga.

- debe detectar la colisión entre objetos. Querremos que los disparos
  de la nave del jugador detecten cuándo colisionan con una nave
  enemiga, que una nave enemiga detecte si colisiona con la nave del
  jugador, que un disparo de la nave enemiga detecte si colisiona con
  la nave del jugador,... necesitamos saber de qué tipo es cada objeto.


*/
describe("Clase GameBoard", function(){

    var canvas, ctx;

    beforeEach(function(){
	loadFixtures('index.html');

	canvas = $('#game')[0];
	expect(canvas).toExist();

	ctx = canvas.getContext('2d');
	expect(ctx).toBeDefined();

    });

    it("add", function(){

	Game = {width: 320, height: 480};

	var miNave = new GameBoard();
	var obj = "nave";
	
	miNave.add(obj);

	expect(miNave.add(obj)).toEqual("nave");

    });

    it("remove", function(){

	Game = {width: 320, height: 480};

	var miNave = new GameBoard();
	var obj = "nave";
	miNave.add(obj);
	expect(miNave.objects[0]).toEqual("nave");	
	miNave.resetRemoved(obj);
	miNave.remove(obj);
	miNave.finalizeRemoved(obj);
	expect(miNave.objects[0]).toEqual(undefined);

    });

    it("iterate", function(){

	Game = {width: 320, height: 480};

	var miNave = new GameBoard();
	miNave.objects = [{obj: function(){}, args: function(){}}];
	spyOn(miNave.objects[0], "obj");
	spyOn(miNave.objects[0], "args");

	miNave.iterate("obj", "obj1", "obj2","obj3");
	miNave.iterate("args", "args1", "args2","args3");
	expect(miNave.objects[0].obj).toHaveBeenCalledWith("obj1", "obj2","obj3");
	expect(miNave.objects[0].args).toHaveBeenCalledWith("args1", "args2","args3");
    });


    it("detect", function(){

	var miNave = new GameBoard();
	var obj = "nave";
	
	miNave.add(obj);

	var func = {call: function(){}};
	spyOn(func, "call");
	miNave.detect(func)
	waits(100);

	expect(miNave.objects[0]).toBeTruthy();
	expect(miNave.objects[1]).toBeFalsy();
	
    });

    it("draw+step", function(){
	var miNave = new GameBoard();

	var board = {
	    step: function (){},
	    draw: function (){}
	};

	spyOn(board, "step");
	spyOn(board, "draw");

	miNave.add(board);
	miNave.step(1);
	miNave.draw(ctx);

	waits(100); 
	runs(function(){
		expect(board.step).toHaveBeenCalled();
		expect(board.draw).toHaveBeenCalled();
	});
    });

    it("overlap", function(){
	var miNave = new GameBoard();
	var o1 = {x:2,y:2,h:1,w:1};
	var o2 = {x:1,y:1,h:2,w:2};

	miNave.add(o1);
	miNave.add(o2);

	expect(miNave.overlap(o1,o2)).toBeTruthy();	
    });

    it("collide", function(){
	var miNave = new GameBoard();
	miNave.objects = [{type:"1",x:2,y:2,h:1,w:1},{type:"2",x:1,y:1,h:2,w:2}];
	var obj = {x:2,y:2,h:1,w:1};

	expect(miNave.collide(obj,"1")).toBeTruthy();
    });
});

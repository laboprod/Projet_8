/*global app, jasmine, describe, it, beforeEach, expect */

describe('controller', () => {
	'use strict';

	let subject, model, view;

	let setUpModel = (todos) => {
		model.read.and.callFake((query, callback) => {
			callback = callback || query;
			callback(todos);
		});

		model.getCount.and.callFake((callback) => {
			let todoCounts = {
				active: todos.filter((todo) => {
					return !todo.completed;
				}).length,
				completed: todos.filter((todo) => {
					return !!todo.completed;
				}).length,
				total: todos.length,
			};

			callback(todoCounts);
		});

		model.remove.and.callFake((id, callback) => {
			callback();
		});

		model.create.and.callFake((title, callback) => {
			callback();
		});

		model.update.and.callFake((id, updateData, callback) => {
			callback();
		});
	};

	let createViewStub = () => {
		let eventRegistry = {};
		return {
			render: jasmine.createSpy('render'),
			bind: (event, handler) => {
				eventRegistry[event] = handler;
			},
			trigger: (event, parameter) => {
				eventRegistry[event](parameter);
			},
		};
	};

	beforeEach(() => {
		model = jasmine.createSpyObj('model', ['read', 'getCount', 'remove', 'create', 'update']);
		view = createViewStub();
		subject = new app.Controller(model, view);
	});

	it('should show entries on start-up', () => {
		// TODO: write test
		let todos = {}; // On crée un objet todos vide
		setUpModel([todos]); // On initialise le modèle avec l'objet
		subject.setView(''); // On initialise la vue sans paramètre
		// On s'attend à appeler la vue avec showEntries et l'objet todos
		expect(view.render).toHaveBeenCalledWith('showEntries', [todos]);
	});

	describe('routing', () => {
		it('should show all entries without a route', () => {
			let todo = { title: 'my todo' };
			setUpModel([todo]);

			subject.setView('');

			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
		});

		it('should show all entries without "all" route', () => {
			let todo = { title: 'my todo' };
			setUpModel([todo]);

			subject.setView('#/');

			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
		});

		it('should show active entries', () => {
			// TODO: write test
			let todo = { title: 'title', completed: false }; // On crée un objet avec la propriété completed: false
			setUpModel([todo]); // On initialise le modèle avec l'objet
			subject.setView('#/active'); // On initialise la vue en affichant les todos qui ont la route active

			// On s'attend a trouver le todo qui a comme paramètre completed. false
			expect(model.read).toHaveBeenCalledWith({ completed: false }, jasmine.any(Function));
			// On s'attend à appeler la vue avec showEntries et l'objet todo
			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
		});

		it('should show completed entries', () => {
			// TODO: write test
			let todo = { title: 'title', completed: true }; // On crée un objet avec la propriété completed: true
			setUpModel([todo]); // On initialise le modèle avec l'objet
			subject.setView('#/completed'); // On initialise la vue en affichant les todos qui ont la route completed

			// On s'attend a trouver le todo qui a comme paramètre completed: true
			expect(model.read).toHaveBeenCalledWith({ completed: true }, jasmine.any(Function));
			// On s'attend à appeler la vue avec showEntries et l'objet todo
			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
		});
	});

	it('should show the content block when todos exists', () => {
		setUpModel([{ title: 'my todo', completed: true }]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
			visible: true,
		});
	});

	it('should hide the content block when no todos exists', () => {
		setUpModel([]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
			visible: false,
		});
	});

	it('should check the toggle all button, if all todos are completed', () => {
		setUpModel([{ title: 'my todo', completed: true }]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('toggleAll', {
			checked: true,
		});
	});

	it('should set the "clear completed" button', () => {
		let todo = { id: 42, title: 'my todo', completed: true };
		setUpModel([todo]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('clearCompletedButton', {
			completed: 1,
			visible: true,
		});
	});

	it('should highlight "All" filter by default', () => {
		// TODO: write test
		setUpModel([]); // On initialise le modele

		subject.setView(''); // On initialise la vue par défaut

		// On s'attend à ce que la vue soit filtrer avec le paramètre par défaut (ici rien)
		expect(view.render).toHaveBeenCalledWith('setFilter', '');
	});

	it('should highlight "Active" filter when switching to active view', () => {
		// TODO: write test
		setUpModel([]); // On initialise le modele

		subject.setView('#/active'); // On initialise la vue avec la route 'active'

		// On s'attend à ce que la vue soit filtrer avec le paramètre active
		expect(view.render).toHaveBeenCalledWith('setFilter', 'active');
	});

	// Test Rajouté
	it('should highlight "Completed" filter when switching to completed view', () => {
		// TODO: write test
		setUpModel([]); // On initialise le modele

		subject.setView('#/completed'); // On initialise la vue avec la route 'completed'

		// On s'attend à ce que la vue soit filtrer avec le paramètre completed
		expect(view.render).toHaveBeenCalledWith('setFilter', 'completed');
	});

	describe('toggle all', () => {
		it('should toggle all todos to completed', () => {
			// TODO: write test
			// On crée un tableau d'objets avec des paramètres completed différents
			let allTodos = [
				{ id: 42, title: 'my todo 42', completed: true },
				{ id: 43, title: 'my todo 43', completed: false },
			];
			setUpModel(allTodos); // On initialise le modéle avec ce tableau
			subject.setView(''); // On initialise la vue sans paramètre particulier

			// Au clic, on passe le paramètre completed: true à tout les todos
			view.trigger('toggleAll', { completed: true });

			// On s'attend à actualiser le modèle avec completed: true pour tout les todos
			expect(model.update).toHaveBeenCalledWith(42, { completed: true }, jasmine.any(Function));
			expect(model.update).toHaveBeenCalledWith(43, { completed: true }, jasmine.any(Function));
		});

		// Test Rajouté
		it('should toggle all todos to active', () => {
			// TODO: write test
			// On crée un tableau d'objets avec des paramètres completed différents
			let allTodos = [
				{ id: 42, title: 'my todo 42', completed: true },
				{ id: 43, title: 'my todo 43', completed: false },
			];
			setUpModel(allTodos); // On initialise le modéle avec ce tableau
			subject.setView(''); // On initialise la vue sans paramètre particulier

			// Au clic, on passe le paramètre completed: false à tout les todos
			view.trigger('toggleAll', { completed: false });

			// On s'attend à actualiser le modèle avec completed: false pour tout les todos
			expect(model.update).toHaveBeenCalledWith(42, { completed: false }, jasmine.any(Function));
			expect(model.update).toHaveBeenCalledWith(43, { completed: false }, jasmine.any(Function));
		});

		it('should update the view', () => {
			// TODO: write test
			// Reprise du update the view de la ligne 341
			let todo = { id: 42, title: 'my todo', completed: true };
			setUpModel([todo]);
			subject.setView('');

			// Au clic, on passe le paramètre completed: false
			view.trigger('toggleAll', { id: 42, completed: false });

			// On s'attend à actualiser la vue avec completed: false
			expect(view.render).toHaveBeenCalledWith('elementComplete', { id: 42, completed: false });
		});
	});

	describe('new todo', () => {
		it('should add a new todo to the model', () => {
			// TODO: write test
			setUpModel([]);
			subject.setView('');

			// au clic on crée dans le modèle un nouveau todo avec comme title: 'a new todo'
			view.trigger('newTodo', 'a new todo');
			expect(model.create).toHaveBeenCalledWith('a new todo', jasmine.any(Function));
		});

		it('should add a new todo to the view', () => {
			setUpModel([]);

			subject.setView('');

			view.render.calls.reset();
			model.read.calls.reset();
			model.read.and.callFake((callback) => {
				callback([
					{
						title: 'a new todo',
						completed: false,
					},
				]);
			});

			view.trigger('newTodo', 'a new todo');

			expect(model.read).toHaveBeenCalled();

			expect(view.render).toHaveBeenCalledWith('showEntries', [
				{
					title: 'a new todo',
					completed: false,
				},
			]);
		});

		it('should clear the input field when a new todo is added', () => {
			setUpModel([]);

			subject.setView('');

			view.trigger('newTodo', 'a new todo');

			expect(view.render).toHaveBeenCalledWith('clearNewTodo');
		});
	});

	describe('element removal', () => {
		it('should remove an entry from the model', () => {
			// TODO: write test
			let todo = { id: 42, title: 'my todo', completed: true };
			setUpModel([todo]);

			subject.setView('');

			// Au clic on supprime cet objet avec l'id 42 du modèle
			view.trigger('itemRemove', { id: 42 });
			expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
		});

		it('should remove an entry from the view', () => {
			let todo = { id: 42, title: 'my todo', completed: true };
			setUpModel([todo]);

			subject.setView('');
			view.trigger('itemRemove', { id: 42 });

			expect(view.render).toHaveBeenCalledWith('removeItem', 42);
		});

		it('should update the element count', () => {
			let todo = { id: 42, title: 'my todo', completed: true };
			setUpModel([todo]);

			subject.setView('');
			view.trigger('itemRemove', { id: 42 });

			expect(view.render).toHaveBeenCalledWith('updateElementCount', 0);
		});
	});

	describe('remove completed', () => {
		it('should remove a completed entry from the model', () => {
			let todo = { id: 42, title: 'my todo', completed: true };
			setUpModel([todo]);

			subject.setView('');
			view.trigger('removeCompleted');

			expect(model.read).toHaveBeenCalledWith({ completed: true }, jasmine.any(Function));
			expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
		});

		it('should remove a completed entry from the view', () => {
			let todo = { id: 42, title: 'my todo', completed: true };
			setUpModel([todo]);

			subject.setView('');
			view.trigger('removeCompleted');

			expect(view.render).toHaveBeenCalledWith('removeItem', 42);
		});
	});

	describe('element complete toggle', () => {
		it('should update the model', () => {
			let todo = { id: 21, title: 'my todo', completed: false };
			setUpModel([todo]);
			subject.setView('');

			view.trigger('itemToggle', { id: 21, completed: true });

			expect(model.update).toHaveBeenCalledWith(21, { completed: true }, jasmine.any(Function));
		});

		it('should update the view', () => {
			let todo = { id: 42, title: 'my todo', completed: true };
			setUpModel([todo]);
			subject.setView('');

			view.trigger('itemToggle', { id: 42, completed: false });

			expect(view.render).toHaveBeenCalledWith('elementComplete', { id: 42, completed: false });
		});
	});

	describe('edit item', () => {
		it('should switch to edit mode', () => {
			let todo = { id: 21, title: 'my todo', completed: false };
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEdit', { id: 21 });

			expect(view.render).toHaveBeenCalledWith('editItem', { id: 21, title: 'my todo' });
		});

		it('should leave edit mode on done', () => {
			let todo = { id: 21, title: 'my todo', completed: false };
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', { id: 21, title: 'new title' });

			expect(view.render).toHaveBeenCalledWith('editItemDone', { id: 21, title: 'new title' });
		});

		it('should persist the changes on done', () => {
			let todo = { id: 21, title: 'my todo', completed: false };
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', { id: 21, title: 'new title' });

			expect(model.update).toHaveBeenCalledWith(21, { title: 'new title' }, jasmine.any(Function));
		});

		it('should remove the element from the model when persisting an empty title', () => {
			let todo = { id: 21, title: 'my todo', completed: false };
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', { id: 21, title: '' });

			expect(model.remove).toHaveBeenCalledWith(21, jasmine.any(Function));
		});

		it('should remove the element from the view when persisting an empty title', () => {
			let todo = { id: 21, title: 'my todo', completed: false };
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', { id: 21, title: '' });

			expect(view.render).toHaveBeenCalledWith('removeItem', 21);
		});

		it('should leave edit mode on cancel', () => {
			let todo = { id: 21, title: 'my todo', completed: false };
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditCancel', { id: 21 });

			expect(view.render).toHaveBeenCalledWith('editItemDone', { id: 21, title: 'my todo' });
		});

		it('should not persist the changes on cancel', () => {
			let todo = { id: 21, title: 'my todo', completed: false };
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditCancel', { id: 21 });

			expect(model.update).not.toHaveBeenCalled();
		});
	});
});
